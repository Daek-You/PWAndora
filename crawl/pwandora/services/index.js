let siteStatusService = null;
let pipelineStatusService = null;
let trancoService = null;

function registerServices({ site, pipeline, tranco }) {
  siteStatusService = site;
  pipelineStatusService = pipeline;
  trancoService = tranco;
}

function getSiteStatusService() {
  return siteStatusService;
}

function getPipelineStatusService() {
  return pipelineStatusService;
}

function getTrancoService() {
  return trancoService;
}

module.exports = {
  registerServices,
  getSiteStatusService,
  getPipelineStatusService,
  getTrancoService,
};
