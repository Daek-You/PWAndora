const { models } = require('../config/dbConfig');
class ScreenshotRepository {
  static async bulkInsert(data, transaction) {
    return await models.screenshot.bulkCreate(data, { transaction });
  }
}
module.exports = ScreenshotRepository;
