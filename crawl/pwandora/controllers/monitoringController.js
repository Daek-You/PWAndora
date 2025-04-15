const {
  getPipelineStatusService,
  getSiteStatusService,
} = require('../services');
const { addSseConnection } = require('../utils/sse/sseConnectionStore');
const { sendInitialData } = require('../utils/sse/sseTemplates');

const connectMonitoringSse = async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cach');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  addSseConnection(res);

  console.log('SSE 연결 성공');
  const pipelineStatusService = getPipelineStatusService();
  const pipelineStatus = await pipelineStatusService.getCurrentStatus();
  if (pipelineStatus.status === 'INPROGRESS') {
    const siteStatusService = getSiteStatusService();
    const [dashboardOverview, siteProcess, siteResult] = await Promise.all([
      pipelineStatusService.getCurrentOverview(),
      siteStatusService.getRecentSiteProcesses(),
      siteStatusService.getRecentSiteResults(),
    ]);

    sendInitialData(
      pipelineStatus,
      dashboardOverview,
      siteProcess,
      siteResult
    );
  }

  req.on('close', () => {
    console.log('SSE 연결 종료');
    res.end();
  });
};

const getCurrentStatus = async (req, res) => {
  try {
    const pipelineStatusService = getPipelineStatusService();
    const currentStatus = await pipelineStatusService.getCurrentStatus();
    res.status(200).json({
      success: true,
      currentStatus,
    });
  } catch (err) {
    console.error('[currentStatus] Error:', err);
    res.status(500).json({
      success: false,
      message: '모니터링 데이터를 불러오는 데 실패했습니다.',
    });
  }
};

module.exports = {
  getCurrentStatus,
  connectMonitoringSse,
};
