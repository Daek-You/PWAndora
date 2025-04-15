const { StepStatus } = require('../../services/redis/enums/pipelineStatus');
const { getSiteStatusService } = require('../../services');
const {
  logSiteStepFailed,
  logSiteStepError,
} = require('../logging/loggerTemplates');

//이미 실패한 스텝인지 확인 후, 최초 1회만 실패 처리
const markFailedOnce = async (site, step) => {
  const siteStatusService = getSiteStatusService();

  const status = await siteStatusService.get(site.id);
  const current = status?.details?.[step]?.status;

  if (current === StepStatus.FAILED) return false;

  await siteStatusService.markFailed(site, step);
  return true;
};

// 실패 로그 + markFailedOnce + 흐름 종료까지 한번에 처리
const failAndExit = async (site, step, reasonOrError, isError = false) => {
  if (isError) {
    logSiteStepError(site, step, reasonOrError);
  } else {
    logSiteStepFailed(site, step, { reason: reasonOrError });
  }

  await markFailedOnce(site, step);
  return null; // 흐름 종료
};

module.exports = {
  markFailedOnce,
  failAndExit,
};
