const { transliterate } = require('transliteration');
const slugify = require('slugify');
const { getSiteStatusService } = require('../../services');
const { logSiteStepTrace } = require('../../utils/logging/loggerTemplates');
const { failAndExit } = require('../logging/statusUtils');
const { extractRelevantHTML } = require('./extractUtil');
const { resolveWorkingUrl } = require('./resolveUrlUtil');
const { PipelineSteps } = require('../../services/redis/enums/pipelineSteps');

const step = PipelineSteps.CHECK;

const safeGoto = async (page, url, timeout = 15000, maxRetries = 2) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout,
      });
    } catch (e) {
      if (e.message.includes('ETIMEDOUT') || e.name === 'TimeoutError') {
        await page.waitForTimeout(1000);
        continue;
      }
      throw e;
    }
  }
  throw new Error(`ETIMEDOUT: ${url}`);
};

const getManifestFromPage = async (page, manifestUrl, site) => {
  try {
    const response = await page.goto(manifestUrl, {
      timeout: 10000,
      waitUntil: 'domcontentloaded',
    });

    if (!response || !response.ok()) {
      return failAndExit(
        site,
        step,
        `Manifest fetch failed with status ${response?.status()}`
      );
    }

    logSiteStepTrace(site, step, 'Manifest fetched');

    const manifestText = await response.text();
    const trimmed = manifestText.trim();

    if (trimmed.startsWith('<!DOCTYPE html') || trimmed.startsWith('<html')) {
      return failAndExit(site, step, 'Manifest returned HTML content');
    }

    try {
      return JSON.parse(trimmed);
    } catch (e) {
      return failAndExit(
        site,
        step,
        `Manifest JSON parse failed: ${e.message}`
      );
    }
  } catch (err) {
    return failAndExit(site, step, err, true);
  }
};

const getManifestResponse = async (page, fullUrl, site) => {
  const siteStatusService = getSiteStatusService();

  try {
    await safeGoto(page, fullUrl, 20000);
    await page.waitForTimeout(1000);

    const html = await page.content();
    const extracted = extractRelevantHTML(html);
    logSiteStepTrace(site, step, 'Main page HTML extracted');
    await siteStatusService.setTempData(
      String(site.id),
      'mainPageData',
      extracted
    );
  } catch (error) {
    return failAndExit(site, step, error, true);
  }

  let manifestHref;
  try {
    manifestHref = await page.$eval('link[rel="manifest"]', (el) =>
      el.getAttribute('href')
    );
  } catch (err) {
    return failAndExit(site, step, 'No <link rel="manifest"> found');
  }

  if (!manifestHref) {
    return failAndExit(site, step, 'Manifest href is empty');
  }

  try {
    const manifestUrl = new URL(manifestHref, fullUrl).href;

    if (!manifestUrl.startsWith('http')) {
      return failAndExit(site, step, `Invalid manifest URL: ${manifestUrl}`);
    }

    const manifest = await getManifestFromPage(page, manifestUrl, site);
    if (!manifest) return null;

    return { manifest, manifestUrl };
  } catch (err) {
    return failAndExit(site, step, err, true);
  }
};

const getAppInfo = async (manifest, manifestUrl, fullUrl, site) => {
  try {
    const {
      start_url = '',
      short_name = '',
      name = '',
      icons = [],
      display = '',
      screenshots = [],
    } = manifest;

    const originalName = short_name || name || '';
    if (!originalName) {
      return failAndExit(site, step, 'Missing short_name and name in manifest');
    }

    const pwaName = slugify(transliterate(originalName), {
      lower: true,
      strict: true,
      trim: true,
    });

    const isPWA =
      start_url &&
      pwaName &&
      Array.isArray(icons) &&
      icons.length > 0 &&
      display;

    if (!isPWA) {
      return failAndExit(
        site,
        step,
        'Required manifest fields missing or invalid'
      );
    }

    logSiteStepTrace(site, step, 'App info extracted');

    const absoluteStartUrl = start_url.startsWith('http')
      ? start_url
      : new URL(start_url, fullUrl).href;

    let iconSrc = null;
    if (Array.isArray(icons) && icons.length > 0) {
      icons.sort((a, b) => {
        const sizeA = parseInt((a.sizes || '0x0').split('x')[0]);
        const sizeB = parseInt((b.sizes || '0x0').split('x')[0]);
        return sizeB - sizeA;
      });
      iconSrc = icons.find((icon) => icon?.src)?.src;
    }

    if (!iconSrc) {
      return failAndExit(site, step, 'No usable icon found in manifest');
    }

    const manifestOrigin = new URL(manifestUrl).origin;
    const fullOrigin = new URL(fullUrl).origin;

    const absoluteIconUrl = await resolveWorkingUrl(iconSrc, [
      manifestOrigin,
      fullOrigin,
    ]);

    if (!absoluteIconUrl) {
      return failAndExit(site, step, 'No usable icon found in manifest');
    }

    const resolvedScreenshots = await Promise.all(
      (screenshots || []).map(async (screenshot) => {
        const src = screenshot.src;
        if (!src) return null;

        const resolved = await resolveWorkingUrl(src, [
          manifestOrigin,
          fullOrigin,
        ]);
        return resolved ? { ...screenshot, src: resolved } : null;
      })
    );

    return {
      id: site.id,
      url: fullUrl,
      start_url: absoluteStartUrl,
      name: pwaName,
      icon: absoluteIconUrl,
      screenshots: resolvedScreenshots.filter(Boolean),
    };
  } catch (err) {
    return failAndExit(site, step, err, true);
  }
};

module.exports = {
  getManifestResponse,
  getAppInfo,
};
