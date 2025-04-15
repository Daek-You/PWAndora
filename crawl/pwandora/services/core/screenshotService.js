const { getSiteStatusService } = require('../../services');
const {
  logSiteStepSuccess,
  logSiteStepFailed,
} = require('../../utils/logging/loggerTemplates');
const {
  downloadManifestScreenshots,
  capturePageScreenshots,
} = require('../../utils/processing/screenshotUtil');
const { PipelineSteps } = require('../redis/enums/pipelineSteps');

const step = PipelineSteps.SCREENSHOT;

const generateScreenshots = async (site) => {
  const siteStatusService = getSiteStatusService();
  const siteId = site.id;

  try {
    const manifest = await siteStatusService.getTempData(siteId, 'manifest');
    const appInfo = await siteStatusService.getTempData(siteId, 'appInfo');

    if (!appInfo) {
      throw new Error('Missing appInfo from temp storage');
    }

    let captured = [];

    if (manifest?.screenshots?.length > 0) {
      captured = await downloadManifestScreenshots(manifest, appInfo);
    }

    const success = await capturePageScreenshots(appInfo, captured);

    if (!success) {
      throw new Error('No valid screenshots captured');
    }

    await siteStatusService.setTempData(
      siteId,
      'screenshotCount',
      captured.length
    );

    logSiteStepSuccess(site, step, { screenshotCount: captured.length });
    await siteStatusService.markSuccess(site, step);
    return true;
  } catch (error) {
    logSiteStepFailed(site, step, { reason: error.message });
    await siteStatusService.markFailed(site, step);
    return false;
  }
};

module.exports = { generateScreenshots };
