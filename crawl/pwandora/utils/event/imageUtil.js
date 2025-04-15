const playwright = require('playwright');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function takeScreenshot(url, imagePath) {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });

    await page.waitForTimeout(2000);

    const dir = path.dirname(imagePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    await page.screenshot({ path: imagePath, fullPage: true });
  } catch (e) {
    console.error('[takeScreenshot Error]', e);
    throw e;
  } finally {
    await browser.close();
  }
}

async function preprocessImage(imagePath) {
  const processedPath = imagePath.replace('.png', '.processed.png');
  try {
    await sharp(imagePath)
      .resize({ width: 1080 })
      .grayscale()
      .normalize()
      .sharpen()
      .toFile(processedPath);

    return processedPath;
  } catch (e) {
    console.error('[preprocessImage Error]', e);
    throw e;
  }
}

module.exports = { takeScreenshot,preprocessImage };
