const { models } = require('../config/dbConfig');
class SiteRepository {
  static async createOrFind({ url }) {
    const [site, created] = await models.site.findOrCreate({
      where: { url },
    });

    return { site, created };
  }

  static async updatePwaId(siteId, pwaId, transaction) {
    return await models.site.update(
      { pwa_id: pwaId},
      { where: { id: siteId }, transaction }
    );
  }

  static async updateStatus(siteId, status, transaction) {
    return await models.site.update(
      { status },
      { where: { id: siteId }, transaction }
    );
  }
}

module.exports = SiteRepository;
