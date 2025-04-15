const { models } = require('../config/dbConfig');
class PwaFileRepository {
  static async bulkInsert(data, transaction) {
    return await models.pwa_file.bulkCreate(data, {
      transaction,
      updateOnDuplicate: [
        'download_url',
        'file_size',
        'file_type',
        'updated_at',
      ],
    });
  }
}
module.exports = PwaFileRepository;
