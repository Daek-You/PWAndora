const csv = require('csv-parser');
const { Op } = require('sequelize');
const { models } = require('../../config/dbConfig');

const Site = models.site;

// csv에서 읽어오기
const handleCsv = async (readableStream) => {
  const results = [];
  const BATCH_SIZE = 100;
  let url;

  return new Promise((resolve, reject) => {
    readableStream
      .pipe(csv())
      .on('data', (row) => {
        url = row.Domain;
        if (!url.startsWith(('http://', 'https://'))) {
          url = `https://${url}`;
        }
        results.push({
          url: url,
          status: 'NONE',
        });
      })
      .on('end', async () => {
        try {
          // 1. DB에서 이미 존재하는 URL 조회
          const existingSites =
            (await Site.findAll({
              attributes: ['url'],
              where: {
                url: {
                  [Op.in]: results.map((item) => item.url),
                },
              },
              raw: true,
            })) || [];

          const existingUrls = new Set(existingSites.map((site) => site.url));

          // 2. 중복되지 않은 데이터만 필터링
          const newSites = results.filter(
            (item) => !existingUrls.has(item.url)
          );

          if (newSites.length === 0) {
            return resolve({ message: '추가할 새로운 데이터가 없습니다.' });
          }

          // 3. 100개 단위로 bulkCreate 실행
          for (let i = 0; i < newSites.length; i += BATCH_SIZE) {
            const batch = newSites.slice(i, i + BATCH_SIZE);
            await Site.bulkCreate(batch);
          }

          resolve({
            message: `CSV 데이터가 성공적으로 저장되었습니다. (${newSites.length}개 추가됨)`,
          });
        } catch (err) {
          reject(err);
        }
      })
      .on('error', (error) => reject(error));
  });
};

module.exports = handleCsv;

module.exports = { handleCsv };
