const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');
const ColorThief = require('colorthief');
const { v4: uuidv4 } = require('uuid');

async function getDominantColorFromUrl(imageUrl) {
  try {
    // 1. 이미지 다운로드 (buffer)
    const response = await axios({
      url: imageUrl,
      responseType: 'arraybuffer',
    });

    // 2. Sharp로 리사이징 및 JPEG 변환
    const processedBuffer = await sharp(response.data)
      .resize(64, 64, { fit: 'inside' })
      .jpeg()
      .toBuffer();

    // 3. ColorThief는 파일 경로만 받으므로 임시 저장
    const tempPath = path.join(__dirname, `${uuidv4()}.jpg`);
    fs.writeFileSync(tempPath, processedBuffer);

    try {
      const rgb = await ColorThief.getColor(tempPath);
      const hex = `#${rgb
        .map((v) => v.toString(16).padStart(2, '0'))
        .join('')}`;
      return hex;
    } finally {
      fs.unlinkSync(tempPath);
    }
  } catch (err) {
    console.error('dominant color 추출 실패:', err.message);
    return '#cccccc'; // fallback color
  }
}

module.exports = getDominantColorFromUrl;
