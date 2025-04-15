const { sendSse } = require('./sendSse');
const { getAllSseConnections } = require('./sseConnectionStore');
const { getPipelineId } = require('../logging/loggerTemplates'); 

const broadcast = (event, payload) => {
  getAllSseConnections().forEach((res) => {
    sendSse(res, event, payload);
  });
};

const sendPipelineStatus = (status, startedAt, finishedAt) => {
  broadcast('pwaCrawler', {
    type: 'pipelineStatus',
    pipelineId: getPipelineId() || 'unknown',
    status,
    startedAt,
    finishedAt,
  });
};

const sendDashboardOverview = (total, processing, pwas, success) => {
  broadcast('pwaCrawler', {
    type: 'dashboardOverview',
    pipelineId: getPipelineId() || 'unknown',
    summary: {
      processing: { value: processing, total },
      pwas: { value: pwas, total: processing },
      success: { value: success, total: pwas },
    },
  });
};

const sendSiteProcess = (site, timestamp, details) => {
  broadcast('pwaCrawler', {
    type: 'siteProcess',
    pipelineId: getPipelineId() || 'unknown',
    site,
    timestamp,
    details,
  });
};

const sendSiteResult = (site, status, timestamp, name, pwaId) => {
  broadcast('pwaCrawler', {
    type: 'siteResult',
    pipelineId: getPipelineId() || 'unknown',
    site,
    status,
    timestamp,
    details: {
      name,
      pwaId: pwaId || '',
    },
  });
};

const sendInitialData = (
  pipelineStatus,
  dashboardOverview,
  siteProcess,
  siteResult
) => {
  broadcast('pwaCrawler', {
    type: 'initialData',
    pipelineId: getPipelineId() || 'unknown',
    pipelineStatus,
    dashboardOverview,
    siteProcess: siteProcess || [],
    siteResult: siteResult || [],
  });
};

module.exports = {
  sendPipelineStatus,
  sendDashboardOverview,
  sendSiteProcess,
  sendSiteResult,
  sendInitialData,
};
