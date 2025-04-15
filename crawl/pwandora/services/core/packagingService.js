const { buildTizenApp } = require('../packaging/tizenBuilder');
const { buildAndroidApp } = require('../packaging/androidBuilder');
const { getSiteStatusService } = require('../../services');
const { logSiteStepError } = require('../../utils/logging/loggerTemplates');
const { PipelineSteps } = require('../redis/enums/pipelineSteps');
const buildWorkerManager = require('../infra/buildWorkerManager');

const androidPackaging = async (site) => {
  const siteStatusService = getSiteStatusService();
  const step = PipelineSteps.ANDROID;

  try {
    return await buildWorkerManager.enqueue({
      type: 'android',
      site,
      handler: buildAndroidApp,
    });
  } catch (error) {
    logSiteStepError(site.id, step, error);
    await siteStatusService.markFailed(site, step);
    throw error;
  }
};

const tizenPackaging = async (site) => {
  const siteStatusService = getSiteStatusService();
  const step = PipelineSteps.TIZEN;

  try {
    return await buildWorkerManager.enqueue({
      type: 'tizen',
      site,
      handler: buildTizenApp,
    });
  } catch (error) {
    logSiteStepError(site.id, step, error);
    await siteStatusService.markFailed(site, step);
    throw error;
  }
};

module.exports = { tizenPackaging, androidPackaging };
