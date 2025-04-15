const RedisBaseService = require('./redisBaseService');
const { StepStatus } = require('./enums/pipelineStatus');
const {
  sendPipelineStatus,
  sendDashboardOverview,
} = require('../../utils/sse/sseTemplates');
const { toKoreanISOString } = require('../../utils/processing/dateUtil');
const { getPipelineId } = require('../../utils/logging/loggerTemplates');

class PipelineStatusService extends RedisBaseService {
  constructor(redis) {
    super(redis, '', 60 * 60 * 12); 
    this.dirty = false;
    this.broadcasting = false;
  }

  _getKey(suffix) {
    const id = getPipelineId() || 'unknown';
    return `pipeline:${id}:${suffix}`;
  }

  // 상태 및 시간 설정
  async setStatus(newStatus) {
    const key = this._getKey('status');
    const current = await this.getHash(key);

    const startTime =
      newStatus === StepStatus.INPROGRESS
        ? toKoreanISOString(Date.now())
        : current.startTime;
    const endTime =
      newStatus === StepStatus.READY
        ? toKoreanISOString(Date.now())
        : current.endTime || null;

    const fields = {
      status: newStatus,
      startTime,
      ...(endTime && { endTime }),
    };

    await this.setHash(key, fields);
    sendPipelineStatus(fields.status, fields.startTime, fields.endTime);
  }

  async getStatus() {
    const key = this._getKey('status');
    return this.getHash(key);
  }

  async initCounters(totalSites) {
    const key = this._getKey('status');
    const fields = {
      totalSites,
      totalProcessed: 0,
      pwaCount: 0,
      noPwaCount: 0,
      savedPwaCount: 0,
      errorCount: 0,
    };
    await this.setHash(key, fields);
  }

  async incrementCounter(field, amount = 1) {
    const key = this._getKey('status');
    await this.incr(key, field, amount);
    this.dirty = true;
  }

  async markStart(totalSites) {
    await this.setStatus(StepStatus.INPROGRESS);
    await this.initCounters(totalSites);
  }

  async markEnd() {
    await this.setStatus(StepStatus.READY);
  }

  startBroadcastLoop() {
    if (this.broadcasting) return;
    this.broadcasting = true;

    this.interval = setInterval(async () => {
      try {
        if (this.dirty) {
          const status = await this.getStatus();

          const totalSites = Number(status.totalSites || 0);
          const totalProcessed = Number(status.totalProcessed || 0);
          const pwaCount = Number(status.pwaCount || 0);
          const savedPwaCount = Number(status.savedPwaCount || 0);

          sendDashboardOverview(
            totalSites,
            totalProcessed,
            pwaCount,
            savedPwaCount
          );
          this.dirty = false;
        }
      } catch (err) {
        console.error('[BROADCAST ERROR]', err);
      }
    }, 1000);
  }

  stopBroadcastLoop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.broadcasting = false;
      this.interval = null;
      console.log('[BROADCAST] 루프 종료됨');
    }
  }

  async getCurrentStatus() {
    const status = await this.getStatus();

    if (!status || Object.keys(status).length === 0) {
      return {
        status: StepStatus.READY,
        startedAt: null,
        endedAt: null,
      };
    }

    return {
      status: status.status || StepStatus.READY,
      startedAt: status.startTime || null,
      endedAt: status.endTime || null,
    };
  }

  async getCurrentOverview() {
    const key = this._getKey('status');
    const status = await this.getHash(key);

    if (!status || Object.keys(status).length === 0) {
      return {
        processing: { value: 0, total: 0 },
        pwas: { value: 0, total: 0 },
        success: { value: 0, total: 0 },
      };
    }

    const total = Number(status.totalSites || 0);
    const processing = Number(status.totalProcessed || 0);
    const pwas = Number(status.pwaCount || 0);
    const success = Number(status.savedPwaCount || 0);

    return {
      processing: { value: processing, total },
      pwas: { value: pwas, total: processing },
      success: { value: success, total: pwas },
    };
  }
}

module.exports = PipelineStatusService;
