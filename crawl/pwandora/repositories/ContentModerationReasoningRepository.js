const { models } = require('../config/dbConfig');

class ContentModerationReasoningRepository {
  static async insertOrUpdate(data, transaction) {
    const { pwa_id } = data;

    const existing = await models.content_moderation_reasoning.findOne({
      where: { pwa_id },
      transaction,
    });

    if (existing) {
      await existing.update(data, { transaction });
      return existing;
    } else {
      const newReasoning = await models.content_moderation_reasoning.create(data, { transaction });
      return newReasoning;
    }
  }
}

module.exports = ContentModerationReasoningRepository; 