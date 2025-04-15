const { checkPWA } = require('../core/manifestService');
const { processAppInfo } = require('./appProcessingService');
const workerManager = require('../infra/workerManager');
const { updateStatus } = require('../../repositories/SiteRepository');
const {
  logPipelineStarted,
  logPipelineFinished,
  logPipelineError,
  logSiteStarted,
  logSiteSuccess,
  logSiteFailed,
  logSiteError,
  logSiteStepStarted,
  logSiteStepSuccess,
} = require('../../utils/logging/loggerTemplates');
const {
  getSiteStatusService,
  getPipelineStatusService,
} = require('../../services');
const { PipelineSteps } = require('../redis/enums/pipelineSteps');
const HealthCheckScheduler = require('../../schedulers/healthCheck');

const MAX_WORKERS = parseInt(process.env.MAX_WORKERS);
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE);

/**
 * 전체 파이프라인 실행
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const runPipeLine = async (sites) => {
  const pipelineStatusService = getPipelineStatusService();
  const siteStatusService = getSiteStatusService();

  HealthCheckScheduler.startJob();
  logPipelineStarted(sites.length);
  await pipelineStatusService.markStart(sites.length);
  await pipelineStatusService.startBroadcastLoop();

  await workerManager.initializeWorkers(Math.min(sites.length, MAX_WORKERS));

  try {
    for (let i = 0; i < sites.length; i += BATCH_SIZE) {
      const batch = sites.slice(i, i + BATCH_SIZE);
      console.log(`▶ BATCH ${i / BATCH_SIZE + 1}, size: ${batch.length}`);
      await Promise.all(batch.map(processSite));
    }
  } catch (error) {
    logPipelineError(error);
  } finally {
    await workerManager.closeAllWorkers();
  }

  await sleep(3000);
  await pipelineStatusService.stopBroadcastLoop();
  await pipelineStatusService.markEnd();
  const status = await pipelineStatusService.getStatus();
  const start = new Date(status.startTime).getTime();
  const end = new Date(status.endTime).getTime();

  const executionTime = ((end - start) / 1000).toFixed(2);
  logPipelineFinished(
    status.totalProcessed,
    status.pwaCount,
    status.noPwaCount,
    status.errorCount,
    status.savedPwaCount,
    executionTime
  );
  HealthCheckScheduler.stopJob();

  return {
    executionTime,
    status,
    message: '모든 작업이 성공적으로 완료되었습니다.',
  };
};

/**
 * 사이트 처리 후 상태 저장
 */
const handleSiteResult = async ({ site, status, logFn, countFn, error }) => {
  logFn?.(site, error);

  if (status) {
    await updateStatus(site.id, status).catch((e) => logSiteError(site, e));
  }

  countFn?.();
};

/**
 * 개별 사이트 처리
 */
const processSite = async (site) => {
  let alreadyHandled = false;

  console.log(`[${site.id}] ${site.url}`);
  const siteStatusService = getSiteStatusService();
  const pipelineStatusService = getPipelineStatusService();

  logSiteStarted(site);

  // checkPWA 단계
  try {
    logSiteStepStarted(site, PipelineSteps.CHECK);
    const appInfo = await checkPWA(site);
    if (!appInfo) {
      await siteStatusService.markFailed(site, PipelineSteps.CHECK);
      alreadyHandled = true;
      await handleSiteResult({
        site,
        status: 'NO_PWA',
        logFn: logSiteFailed,
        countFn: () => pipelineStatusService.incrementCounter('noPwaCount'),
      });
      return;
    }

    logSiteStepSuccess(site, PipelineSteps.CHECK);
    await siteStatusService.markSuccess(site, PipelineSteps.CHECK);
    await pipelineStatusService.incrementCounter('pwaCount');
  } catch (e) {
    if (!alreadyHandled) {
      await handleSiteResult({
        site,
        status: 'NO_PWA',
        logFn: (s) => logSiteError(s, e),
        countFn: () => pipelineStatusService.incrementCounter('errorCount'),
        error: e,
      });
      alreadyHandled = true;
    }
    return;
  }

  // 후속 처리 단계
  try {
    const success = await processAppInfo(site);
    if (!success) {
      throw new Error('App post-processing failed');
    } else {
      siteStatusService.markSuccess(site, PipelineSteps.SAVE);
      pipelineStatusService.incrementCounter('savedPwaCount');
    }

    await handleSiteResult({
      site,
      status: 'CONFIRM',
      logFn: logSiteSuccess,
    });
  } catch (e) {
    if (!alreadyHandled) {
      await handleSiteResult({
        site,
        status: 'NO_PWA',
        logFn: (s) => logSiteError(s, e),
        countFn: () => pipelineStatusService.incrementCounter('errorCount'),
        error: e,
      });
    }
  }
};

module.exports = { runPipeLine };
