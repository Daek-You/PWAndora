const { models } = require('../config/dbConfig');

class EventRepository {
  static async insertOrUpdate(data) {
    const { pwa_id } = data;

    const existing = await models.event.findOne({
      where: { pwa_id },
    });
    console.log(existing);

    if (existing) {
      // 기존 데이터가 있으면 업데이트
      await existing.update(data);
      return existing;
    } else {
      // 새로운 데이터 생성
      const event = await models.event.create(data);
      return event;
    }
  }
}

module.exports = EventRepository;
