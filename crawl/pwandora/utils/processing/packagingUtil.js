const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const sharp = require('sharp');
const { getKoreanDateString } = require('./dateUtil');
const { v4: uuidv4 } = require('uuid');
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

const getSafeName = (name) => {
  return name
    .replace(/[^\w\s가-힣.-]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/__+/g, '_')
    .replace(/^_|_$/g, '');
};

const downloadIconToPath = async (iconUrl, targetPath) => {
  const response = await axios({
    method: 'GET',
    url: iconUrl,
    responseType: 'arraybuffer',
    timeout: 10000,
  });

  const buffer = await sharp(response.data).png().toBuffer();
  await mkdirAsync(path.dirname(targetPath), { recursive: true });
  await writeFileAsync(targetPath, buffer);

  return targetPath;
};

const generateFileName = (appName, ext = '.jpg') => {
  const safeName = getSafeName(appName);
  const today = getKoreanDateString();
  const randomId = uuidv4().split('-')[0];
  return `${safeName}_${today}_${randomId}${ext}`;
};

module.exports = {
  getSafeName,
  downloadIconToPath,
  generateFileName,
};
