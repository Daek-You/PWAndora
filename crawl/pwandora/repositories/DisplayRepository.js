const { models } = require('../config/dbConfig');

class DisplayRepository {
  static async insertOrUpdate(data, transaction) {
    const { pwa_id } = data;

    const existing = await models.display.findOne({
      where: { pwa_id },
      transaction,
    });

    if (existing) {
      // 기존 데이터가 있으면 업데이트
      await existing.update(data, { transaction });
      return existing;
    } else {
      // 새로운 데이터 생성
      const newDisplay = await models.display.create(data, { transaction });
      return newDisplay;
    }
  }

  static async bulkInsert(data, transaction) {
    return await models.display.bulkCreate(data, {
      updateOnDuplicate: [
        'image_url_large',
        'image_url_medium',
        'image_url_small',
        'is_large',
        'is_medium',
        'is_small',
      ],
      transaction,
    });
  }
}

module.exports = DisplayRepository; 