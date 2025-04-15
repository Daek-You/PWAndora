const { handleCsv } = require('../services/infra/siteService');
const { Readable } = require('stream');
const SiteRepository = require('../repositories/SiteRepository');
const { runPipeLine } = require('../services/process/pipelineService');

const saveSitesFromCsv = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '파일이 없습니다.' });
  }

  const fileBuffer = req.file.buffer;
  const readableStream = Readable.from(fileBuffer.toString());

  try {
    const result = await handleCsv(readableStream);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSiteAndProcess = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res
      .status(400)
      .json({ success: false, message: '사이트 주소가 필요합니다.' });
  }

  try {
    // 1. 사이트 저장
    const { site, created } = await SiteRepository.createOrFind({ url });

    if (!created) {
      console.log(`[INFO] 이미 등록된 사이트: ${url}`);

      return res.status(200).json({
        success: true,
        message: '이미 등록된 사이트입니다.',
      });
    }
    // 2. 파이프라인 실행
    const result = await runPipeLine([site]);

    return res.status(201).json({
      success: true,
      site,
      pipelineResult: result,
    });
  } catch (error) {
    console.error('사이트 등록 또는 파이프라인 실패:', error);
    return res.status(500).json({ success: false, message: '서버 오류 발생' });
  }
};

module.exports = { saveSitesFromCsv, createSiteAndProcess };
