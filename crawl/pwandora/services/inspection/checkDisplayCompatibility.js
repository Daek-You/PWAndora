const sharp = require('sharp');
const { uploadToS3 } = require('../../services/infra/s3Service');
const { getSiteStatusService } = require('../../services');
const {
  logSiteStepStarted,
  logSiteStepSuccess,
  logSiteStepFailed,
} = require('../../utils/logging/loggerTemplates');
const { InspectionSteps } = require('../redis/enums/inspectionSteps');

const step = InspectionSteps.CHECK_DISPLAY_COMPATIBILITY;

const resolutions = [
  { width: 1080, height: 1920, label: '32inch', key: 'screenshotLarge' },
  { width: 1024, height: 600, label: '9or7inch', key: 'screenshotMedium' },
  { width: 800, height: 480, label: '4.3inch', key: 'screenshotSmall' },
];

const applyStealth = async (page) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
    });
    window.chrome = { runtime: {} };
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (params) => {
      if (params.name === 'notifications') {
        return Promise.resolve({ state: Notification.permission });
      }
      return originalQuery(params);
    };
    delete navigator.userAgentData;
  });
};

const checkDisplayCompatibility = async (site, appInfo, browser) => {
  logSiteStepStarted(site, step);
  const siteId = site.id;
  try {
    const siteStatusService = getSiteStatusService();

    for (const resolution of resolutions) {
      const context = await browser.newContext({
        ignoreHTTPSErrors: true,
        viewport: {
          width: resolution.width,
          height: resolution.height,
        },
        deviceScaleFactor: 3,
        isMobile: resolution.width <= 1024,
        hasTouch: true,
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      });

      const page = await context.newPage();
      await applyStealth(page);

      // 페이지 로드
      await page.goto(appInfo.url, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(2000);

      // 스크린샷 촬영
      const screenshotBuffer = await page.screenshot({
        type: 'png',
      });

      // WebP로 변환 및 최적화
      const webpBuffer = await sharp(screenshotBuffer)
        .webp({ quality: 70, lossless: false, smartSubsample: true, effort: 4 })
        .toBuffer();

      // 파일명 생성
      const fileName = `${appInfo.name}_${resolution.label}_${Date.now()}.webp`;

      // S3에 업로드
      const uploadedUrl = await uploadToS3(appInfo.name, fileName, webpBuffer);

      // TempData에 저장
      await siteStatusService.setTempData(siteId, resolution.key, uploadedUrl);

      await context.close();
    }

    logSiteStepSuccess(site, step);
    return true;
  } catch (error) {
    logSiteStepFailed(site, step, {
      reason: 'Failed to capture screenshots for display compatibility check',
    });
    console.error('Display Compatibility 검수 중 에러 발생:', error);
    return false;
  }
};

module.exports = { checkDisplayCompatibility };
