const playwright = require('playwright');

async function extractEventLink(homepageUrl) {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(homepageUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    });

    await page.waitForTimeout(2000);

    const links = await page.$$eval('a', (elements) =>
      elements.map((el) => ({
        text: el.innerText || '',
        href: el.href || '',
        title: el.title || '',
        ariaLabel: el.getAttribute('aria-label') || '',
        dataAttr: el.getAttribute('data-label') || '',
      }))
    );

    const keywordRegex =
      /이벤트|event|프로모션|promotion|행사|show|특가|special|할인|discount|혜택|benefit|coupon|쿠폰|기획전|off|deal/i;

    const matchedLink = links.find((link) =>
      keywordRegex.test(
        `${link.text} ${link.href} ${link.title} ${link.ariaLabel} ${link.dataAttr}`
      )
    );
    
    return matchedLink?.href || null;
  } catch (e) {
    console.error('[extractEventLink Error]', e);
    return null;
  } finally {
    await browser.close();
  }
}

module.exports = { extractEventLink };
