const { getTrancoService } = require('../services');

const collectUrlsHandler = async (req, res) => {
  try {
    console.log('Tranco 리스트 수집 시작:', new Date());
    const trancoService = getTrancoService();
    await trancoService.syncLatestTrancoList();

    return res.status(200).json({
      success: true,
      message: 'Tranco 리스트 수집 및 처리 완료',
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Tranco 리스트 수집 실패:', error);
    return res.status(500).json({
      success: false,
      message: 'Tranco 리스트 수집 중 오류 발생',
      error: error.message,
    });
  }
};

module.exports = { collectUrlsHandler };
