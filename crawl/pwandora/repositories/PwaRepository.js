const { models } = require('../config/dbConfig');

class PwaRepository {
  // 데이터를 새로 삽입 또는 업데이트
  static async insertOrUpdate(data, transaction) {
    const existing = await models.pwa.findOne({
      where: { website_url: data.website_url },
      transaction,
    });
    
    if (existing) {
      // 데이터가 이미 존재하면 업데이트
      await existing.update(data, { transaction });
      return existing;
    } else {
      // 데이터가 없다면 새로 삽입
      const newPwa = await models.pwa.create(data, { transaction });
      return newPwa;
    }
  }

  static async findOneByPwaId(pwaId, transaction) {
    return await models.pwa.findOne({
      where: { id: pwaId },
      transaction,
    });
  }
}

module.exports = PwaRepository;
