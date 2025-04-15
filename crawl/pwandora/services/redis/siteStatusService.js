const RedisBaseService = require('./redisBaseService');
const { StepStatus } = require('./enums/pipelineStatus');
const { PipelineSteps } = require('./enums/pipelineSteps');
const { toKoreanISOString } = require('../../utils/processing/dateUtil');
const {
  sendSiteProcess,
  sendSiteResult,
} = require('../../utils/sse/sseTemplates');
const { getPipelineId } = require('../../utils/logging/loggerTemplates');

class SiteStatusService extends RedisBaseService {
  constructor(redis) {
    super(redis, '', 60 * 60);
  }

  _getKey(suffix) {
    const id = getPipelineId() || 'unknown';
    return `pwa:${id}:${suffix}`;
  }

  async init(site) {
    const siteId = String(site.id);
    const now = toKoreanISOString(Date.now());
    const status = {
      status: StepStatus.INPROGRESS,
      timestamp: now,
      details: {},
    };
    Object.values(PipelineSteps).forEach((step) => {
      status.details[step] = { status: StepStatus.READY };
    });

    await this.setField(siteId, 'siteStatus', status);
    await this.setField(siteId, 'siteUrl', site.url);

    const processKey = this._getKey('list:siteProcess');
    await this.redis.lPush(processKey, siteId);
    await this.redis.expire(processKey, 60 * 60);

    sendSiteProcess(site, status.timestamp, status.details);
  }

  async updateStep(site, step, status) {
    const siteId = String(site.id);
    const now = toKoreanISOString();

    const current = await this.get(siteId);
    if (!current?.details || current.status !== StepStatus.INPROGRESS) return;

    const prevStatus = current.details[step]?.status;
    if (prevStatus === status) return;

    current.details[step] = { status, timestamp: now };
    await this.setField(siteId, 'siteStatus', current);

    sendSiteProcess(site, current.timestamp, current.details);

    if (status === StepStatus.FAILED && step !== PipelineSteps.CHECK) {
      console.log('[updateStep] 실패 처리로 siteResult 전송 예정');
      await this._sendResult(site, StepStatus.FAILED);
    }

    if (status === StepStatus.SUCCESS && step === PipelineSteps.SAVE) {
      console.log('[updateStep] 성공 처리로 siteResult 전송 예정');
      await this._sendResult(site, StepStatus.SUCCESS);
    }
  }

  async _sendResult(site, resultStatus) {
    const siteId = String(site.id);
    const now = toKoreanISOString();

    const current = (await this.get(siteId)) || {};
    if (current.status !== StepStatus.INPROGRESS) return;

    const tempData = await this.getAllTempData(siteId);
    const name = tempData?.appInfo?.name || '';
    const pwaId = Number.isFinite(Number(tempData?.pwaId))
      ? Number(tempData.pwaId)
      : null;

    current.status = resultStatus;
    current.finishedAt = now;
    await this.setField(siteId, 'siteStatus', current);

    const keyList = this._getKey('list:siteResult');
    const keyMap = this._getKey('map:siteResult');

    const result = {
      site,
      status: resultStatus,
      timestamp: now,
      details: { name, pwaId },
    };

    try {
      const commands = [
        ['lRem', keyList, 0, siteId],
        ['rPush', keyList, siteId],
        ['hSet', keyMap, siteId, JSON.stringify(result)],
        ['lTrim', keyList, -100, -1],
      ];
      console.log('[sendResult] Redis 업데이트:', commands);

      await this.redis.multi(commands).exec();

      await this.redis.expire(keyList, 60 * 60);
      await this.redis.expire(keyMap, 60 * 60);
    } catch (e) {
      console.error('siteResult 큐 갱신 중 Redis 오류 발생:', e);
    }

    console.log('[sendResult] SSE 전송:', {
      siteId,
      resultStatus,
      name,
      pwaId,
      timestamp: now,
    });

    sendSiteResult(site, resultStatus, now, name, pwaId);
    await this.clearTempData(siteId);
  }

  async get(siteId) {
    return this.getField(String(siteId), 'siteStatus');
  }

  async setTempData(siteId, key, value) {
    await this.setField(String(siteId), key, value, 60 * 60);
  }

  async getTempData(siteId, key) {
    return this.getField(String(siteId), key);
  }

  async getAllTempData(siteId) {
    return this.getAll(String(siteId));
  }

  async clearTempData(siteId) {
    await this.del(String(siteId));
  }

  async markSuccess(site, step) {
    return this.updateStep(site, step, StepStatus.SUCCESS);
  }

  async markFailed(site, step) {
    return this.updateStep(site, step, StepStatus.FAILED);
  }

  async getRecentSiteProcesses() {
    const key = this._getKey('list:siteProcess');
    const ids = await this.redis.lRange(key, 0, 9);
    const results = await Promise.all(
      ids.map(async (siteId) => {
        const id = String(siteId);
        const status = await this.get(id);
        if (!status) return null;
        try {
          return {
            site: {
              id,
              url: await this.getTempData(id, 'siteUrl'),
            },
            ...status,
          };
        } catch (e) {
          console.warn(`siteStatus JSON 파싱 실패: ${id}`);
          return null;
        }
      })
    );
    return results.filter(Boolean);
  }

  async getRecentSiteResults() {
    const keyList = this._getKey('list:siteResult');
    const keyMap = this._getKey('map:siteResult');

    const siteIds = await this.redis.lRange(keyList, -50, -1);
    console.log('[getRecentSiteResults] 조회된 siteIds:', siteIds);

    const seen = new Set();
    const uniqueIds = [];

    for (let i = siteIds.length - 1; i >= 0 && uniqueIds.length < 10; i--) {
      const id = String(siteIds[i]);
      if (!seen.has(id)) {
        seen.add(id);
        uniqueIds.push(id);
      }
    }

    const results = await Promise.all(
      uniqueIds.map(async (id) => {
        try {
          const raw = await this.redis.hGet(keyMap, id);
          if (!raw) {
            console.warn(`[siteResult] ID: ${id} → HGET 결과 없음`);
            return null;
          }
          return JSON.parse(raw);
        } catch (e) {
          console.warn(`[siteResult] ID: ${id} → 파싱 실패`, e);
          return null;
        }
      })
    );

    const final = results.filter(Boolean).reverse();
    console.log('[getRecentSiteResults] 최종 반환 결과:', final);
    return final;
  }
}

module.exports = SiteStatusService;
