const { runPipeLine } = require('../services/process/pipelineService');
const { models } = require('../config/dbConfig');
const { Op } = require('sequelize');
const { logPipelineError } = require('../utils/logging/loggerTemplates');

const runPipelineHandler = async (req, res) => {
  const firstId = req.body.firstId;
  const lastId = req.body.lastId;

  const allResults = [];

  for (let i = firstId; i <= lastId; i += 10000) {
    try {
      const uncensoredSites = await models.site.findAll({
        attributes: ['id', 'url'],
        where: {
          status: 'NONE',
          id: { [Op.between]: [i, Math.min(i + 9999, lastId)] },
        },
      });

      console.log(
        `${i}번 사이트부터 크롤링 시작 (${uncensoredSites.length}개)`
      );
      const result = await runPipeLine(uncensoredSites);
      allResults.push(result);
    } catch (error) {
      error;
      return res.status(500).json({
        message: '서버 오류가 발생했습니다.',
        error: error.message,
      });
    }
  }
  res.status(200).json(allResults);
};

module.exports = { runPipelineHandler };
