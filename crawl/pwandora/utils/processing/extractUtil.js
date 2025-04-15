const cheerio = require('cheerio');

// HTML에서 의미 있는 텍스트 정보만 추출
const extractRelevantHTML = (html) => {
  const $ = cheerio.load(html);

  $('script, style, link[rel="stylesheet"], noscript').remove();
  $('[class]').removeAttr('class');
  $('[style]').removeAttr('style');
  $('[onclick]').removeAttr('onclick');
  $('[onload]').removeAttr('onload');
  $('*').each((i, el) => {
    Object.keys(el.attribs || {}).forEach((attr) => {
      if (attr.startsWith('data-')) {
        $(el).removeAttr(attr);
      }
    });
  });

  const title = $('title').text().trim();
  const description = $('meta[name="description"]').attr('content') || '';
  const keywords = $('meta[name="keywords"]').attr('content') || '';
  const headings = $('h1, h2, h3')
    .map((i, el) => $(el).text().trim())
    .get()
    .join(' | ');
  const paragraphs = $('p')
    .map((i, el) => $(el).text().trim())
    .get()
    .join('\n')
    .slice(0, 3000);
  const lists = $('ul, ol')
    .map((i, el) => $(el).text().trim())
    .get()
    .join('\n');
  const tables = $('table')
    .map((i, el) => $(el).text().trim())
    .get()
    .join('\n');
  const links = $('a')
    .map((i, el) => $(el).attr('href'))
    .get()
    .join(' | ');
  const images = $('img')
    .map((i, el) => $(el).attr('src'))
    .get()
    .join(' | ');

  return `
Title: ${title}
Description: ${description}
Keywords: ${keywords}
Headings: ${headings}
Content:
${paragraphs}

Lists:
${lists}

Tables:
${tables}

Links:
${links}

Images:
${images}
  `.trim();
};

module.exports = {
  extractRelevantHTML,
};
