const { models } = require('../config/dbConfig');
class ContentRepository {
  static async bulkInsert(data, transaction) {
    return await models.content.bulkCreate(data, {
      transaction,
      updateOnDuplicate: ['description', 'summary', 'name'],
    });
  }

  static async findOneByPwaId(data, transaction) {
    return await models.content.findOne({
      where: data,
      transaction,
    });
  }
}
module.exports = ContentRepository;
