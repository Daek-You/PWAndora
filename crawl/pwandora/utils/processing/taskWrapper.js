const { getSiteStatusService } = require('../../services');
const {
  logSiteStepStarted,
  logSiteStepSuccess,
} = require('../logging/loggerTemplates');

/**
 * 공통 단계 실행 유틸
 */
const abortableTask = async (step, fn, site) => {
  logSiteStepStarted(site, step);
  const siteStatusService = getSiteStatusService();

  try {
    const result = await fn(site);
    if (!result) throw new Error(`${step} returned falsy`);
    logSiteStepSuccess(site, step);
    await siteStatusService.markSuccess(site, step);
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = { abortableTask };
