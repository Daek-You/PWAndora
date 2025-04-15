const { models } = require('../config/dbConfig');

class SecurityRepository {
  static async insertOrUpdate(data, transaction) {
    const { pwa_id } = data;

    const existing = await models.security.findOne({
      where: { pwa_id },
      transaction,
    });

    if (existing) {
      await existing.update(data, { transaction });
      return existing;
    } else {
      const newSecurity = await models.security.create(data, { transaction });
      return newSecurity;
    }
  }
}

module.exports = SecurityRepository; 