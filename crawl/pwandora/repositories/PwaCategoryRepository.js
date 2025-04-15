const { models } = require('../config/dbConfig');
class PwaCategoryRepository {
  static async bulkInsert(data, transaction) {
    return await models.pwa_category.bulkCreate(data, { transaction });
  }
}

module.exports = PwaCategoryRepository;
