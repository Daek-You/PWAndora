const Tesseract = require('tesseract.js');

async function extractTextFromImage(imagePath) {
  try {
    const {
      data: { text },
    } = await Tesseract.recognize(imagePath, 'kor+eng', {
      tessjs_create_pdf: '0',
    });

    return text;
  } catch (e) {
    console.error('[extractTextFromImage Error]', e);
    throw e;
  }
}

module.exports = { extractTextFromImage };
