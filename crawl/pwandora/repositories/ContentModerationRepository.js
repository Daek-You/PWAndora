const { models } = require('../config/dbConfig');

class ContentModerationRepository {
  static async insertOrUpdate(data, transaction) {
    const { pwa_id } = data;

    const existing = await models.content_moderation.findOne({
      where: { pwa_id },
      transaction,
    });

    if (existing) {
      await existing.update(data, { transaction });
      return existing;
    } else {
      const newModeration = await models.content_moderation.create(data, { transaction });
      return newModeration;
    }
  }
}

module.exports = ContentModerationRepository; 