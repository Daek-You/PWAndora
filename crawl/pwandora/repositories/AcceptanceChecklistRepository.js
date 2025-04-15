const { models } = require('../config/dbConfig');

class AcceptanceChecklistRepository {
  static async insertOrUpdate(data, transaction) {
    const { pwa_id } = data;

    const existing = await models.acceptance_checklist.findOne({
      where: { pwa_id },
      transaction,
    });

    if (existing) {
      // 기존 데이터가 있으면 업데이트
      await existing.update(data, { transaction });
      return existing;
    } else {
      // 새로운 데이터 생성
      const newChecklist = await models.acceptance_checklist.create(data, { transaction });
      return newChecklist;
    }
  }
}

module.exports = AcceptanceChecklistRepository; 