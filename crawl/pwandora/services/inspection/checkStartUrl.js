const { getSiteStatusService } = require('../../services');
const {
  logSiteStepStarted,
  logSiteStepSuccess,
  logSiteStepFailed,
} = require('../../utils/logging/loggerTemplates');
const { InspectionSteps } = require('../redis/enums/inspectionSteps');

const step = InspectionSteps.CHECK_URL_ACCESSIBILITY;

// 1. start_url 작동 여부
const checkUrlAccessibility = async (site, url, sharedBrowser) => {
  logSiteStepStarted(site, step);
  const siteStatusService = getSiteStatusService();
  const siteId = site.id;

  if (!url || !sharedBrowser) {
    logSiteStepFailed(site, step, {
      reason: 'Required parameters missing: url or browser instance',
    });
    return false;
  }

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      timeout: 5000,
    });

    await siteStatusService.setTempData(siteId, 'crawled_status', 'DONE');
    logSiteStepSuccess(site, step);
    return response.ok;
  } catch (error) {
    try {
      const context = await sharedBrowser.newContext({
        ignoreHTTPSErrors: true,
        viewport: { width: 360, height: 800 },
        deviceScaleFactor: 3,
        headless: true,
      });

      const page = await context.newPage();

      try {
        const response = await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 10000,
        });

        await siteStatusService.setTempData(siteId, 'crawled_status', 'DONE');
        logSiteStepSuccess(site, step);
        return response && response.status() >= 200 && response.status() < 300;
      } finally {
        if (page) await page.close().catch(() => {});
        if (context) await context.close().catch(() => {});
      }
    } catch (browserError) {
      console.error('URL 접근성 검사 실패:', browserError);
      await siteStatusService.setTempData(siteId, 'crawled_status', 'WARNING');
      logSiteStepSuccess(site, step);
      return false;
    }
  }
};

module.exports = { checkUrlAccessibility };
