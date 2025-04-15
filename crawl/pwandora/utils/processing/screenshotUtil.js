const cheerio = require('cheerio');
const { getKoreanDateString } = require('./dateUtil');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const sharp = require('sharp');
const { uploadToS3 } = require('../../services/infra/s3Service');
const workerManager = require('../../services/infra/workerManager');
const {
  logSiteStepFailed,
  logSiteStepTrace,
} = require('../../utils/logging/loggerTemplates');
const { PipelineSteps } = require('../../services/redis/enums/pipelineSteps');
const { getSiteStatusService } = require('../../services');

const step = PipelineSteps.SCREENSHOT;

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

const extractLinks = (html, baseUrl, limit = 20) => {
  const $ = cheerio.load(html);
  const links = new Set();
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('javascript:')
    )
      return;
    try {
      const absolute = new URL(href, baseUrl).href;
      if (new URL(absolute).origin === new URL(baseUrl).origin) {
        links.add(absolute);
      }
    } catch {}
  });
  return Array.from(links).slice(0, limit);
};

const captureScreenshot = async (page, url, appName) => {
  try {
    await applyStealth(page);
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(2000);

    const safeName = appName.replace(/[^a-zA-Z0-9\uAC00-\uD7A3]/g, '_');
    const today = getKoreanDateString();
    const randomId = uuidv4().split('-')[0];
    const fileName = `${safeName}_${today}_${randomId}.webp`;

    const rawBuffer = await page.screenshot();
    const webpBuffer = await sharp(rawBuffer)
      .webp({ quality: 70, lossless: false, smartSubsample: true, effort: 4 })
      .toBuffer();

    const fileUrl = await uploadToS3(appName, fileName, webpBuffer);
    return { url, savedPath: fileUrl, success: true };
  } catch (error) {
    return { url, success: false, error: error.message };
  }
};

const capturePageScreenshots = async (appInfo, alreadyCaptured = []) => {
  const siteStatusService = getSiteStatusService();
  const successful = Array.isArray(alreadyCaptured) ? [...alreadyCaptured] : [];
  let browser, context, page;

  try {
    browser = await workerManager.getWorker();
    if (!browser) throw new Error('No browser instance');

    context = await browser.newContext({
      ignoreHTTPSErrors: true,
      viewport: { width: 360, height: 800 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });
    page = await context.newPage();

    const main = await captureScreenshot(page, appInfo.url, appInfo.name);
    if (main.success) successful.push(main.savedPath);

    await page.goto(appInfo.url);
    const html = await page.content();
    const links = extractLinks(html, appInfo.url, 20);

    const concurrency = 5;
    for (
      let i = 0;
      i < links.length && successful.length < 5;
      i += concurrency
    ) {
      const group = links.slice(i, i + concurrency);
      const subResults = await Promise.all(
        group.map((url) => captureScreenshot(page, url, appInfo.name))
      );
      subResults.forEach((r) => {
        if (r.success) successful.push(r.savedPath);
      });
      if (successful.length >= 5) break;
    }

    await siteStatusService.setTempData(appInfo.id, 'screenshots', successful);
    return true;
  } catch (error) {
    logSiteStepFailed({ id: appInfo.id, url: appInfo.url }, step, {
      reason: error.message,
    });
    return false;
  } finally {
    if (page && !page.isClosed()) {
      try {
        await page.close();
      } catch (e) {
        logSiteStepTrace({ id: appInfo.id }, step, 'Page closing error', {
          error: e.message,
        });
      }
    }
    if (context) {
      try {
        await context.close();
      } catch (e) {
        logSiteStepTrace({ id: appInfo.id }, step, 'Context closing error', {
          error: e.message,
        });
      }
    }
    if (browser) {
      try {
        await workerManager.releaseWorker(browser);
      } catch (e) {
        logSiteStepTrace({ id: appInfo.id }, step, 'Worker release error', {
          error: e.message,
        });
      }
    }
  }
};

const downloadManifestScreenshots = async (manifest, appInfo) => {
  const screenshots = manifest?.screenshots || [];
  const successful = [];

  for (let i = 0; i < screenshots.length && successful.length < 5; i++) {
    const src = screenshots[i].src;
    if (!src) continue;

    let imageUrl;
    try {
      imageUrl = src.startsWith('http')
        ? src
        : new URL(src, manifest.start_url || appInfo.url).href;
    } catch {
      continue;
    }

    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'image/*' },
      });

      const webpBuffer = await sharp(response.data)
        .webp({ quality: 70, lossless: false, smartSubsample: true, effort: 4 })
        .toBuffer();

      const safeName = appInfo.name.replace(/[^a-zA-Z0-9\uAC00-\uD7A3]/g, '_');
      const today = getKoreanDateString();
      const randomId = uuidv4().split('-')[0];
      const fileName = `${safeName}_${today}_${randomId}.webp`;

      const uploadedUrl = await uploadToS3(appInfo.name, fileName, webpBuffer);
      successful.push(uploadedUrl);
    } catch {}
  }

  return successful;
};

module.exports = {
  capturePageScreenshots,
  downloadManifestScreenshots
};
