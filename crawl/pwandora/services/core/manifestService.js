const { getValidMainDomain } = require('../infra/urlService');
const {
  getManifestResponse,
  getAppInfo,
} = require('../../utils/processing/manifestUtil');
const workerManager = require('../infra/workerManager');
const {
  getSiteStatusService,
  getPipelineStatusService,
} = require('../../services');
const {
  logSiteStepSuccess,
  logSiteStepTrace,
} = require('../../utils/logging/loggerTemplates');
const { failAndExit } = require('../../utils/logging/statusUtils');
const { PipelineSteps } = require('../../services/redis/enums/pipelineSteps');

const step = PipelineSteps.CHECK;

const checkPWA = async (site) => {
  const siteStatusService = getSiteStatusService();
  const pipelineStatusService = getPipelineStatusService();

  const siteId = site.id;
  let browser = null;
  let context = null;
  let page = null;

  try {
    const fullUrl = await getValidMainDomain(site.url);
    if (!fullUrl) return failAndExit(site, step, 'Not valid URL');

    browser = await workerManager.getWorker();
    await siteStatusService.init(site);
    await pipelineStatusService.incrementCounter('totalProcessed');

    if (!browser) return failAndExit(site, step, 'Browser worker not found');

    try {
      context = await browser.newContext();
      page = await context.newPage();
      logSiteStepTrace(site, step, 'Browser context and page generated');
    } catch (error) {
      return failAndExit(
        site,
        step,
        `context generation failed: ${error.message}`
      );
    }

    const manifestResult = await getManifestResponse(page, fullUrl, site);
    if (!manifestResult) return null;

    const { manifest, manifestUrl } = manifestResult;

    const appInfo = await getAppInfo(manifest, manifestUrl, fullUrl, site);
    if (!appInfo) return null; // 내부에서 failAndExit 호출됨

    await siteStatusService.setTempData(siteId, 'appInfo', appInfo);
    await siteStatusService.setTempData(siteId, 'manifest', manifest);
    await siteStatusService.setTempData(siteId, 'manifestUrl', manifestUrl);

    logSiteStepSuccess(site, step);
    await siteStatusService.markSuccess(site, step);
    return appInfo;
  } catch (error) {
    await failAndExit(site, step, error, true);
    return null;
  } finally {
    try {
      if (page) await page.close();
      if (context) await context.close();
    } catch (error) {
      logSiteStepTrace(site, step, 'Page, context closing failed', {
        reason: error.message,
      });
    }

    try {
      if (browser) await workerManager.releaseWorker(browser);
    } catch (releaseErr) {
      logSiteStepTrace(site, step, 'Worker releasing failed', {
        reason: releaseErr.message,
      });
    }
  }
};

module.exports = { checkPWA };
