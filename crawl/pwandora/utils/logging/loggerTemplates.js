const { log } = require('./loggerHelper');
const loggerInstance = require('./logger');
const { generateSiteMessage } = require('./messageGenerator');
const { v4: uuidv4 } = require('uuid');

let internalPipelineId = null;

const getPipelineId = () => internalPipelineId;

const logWithPipeline = (logData) => {
  log(loggerInstance, {
    ...logData,
    pipelineId: getPipelineId(),
  });
};

module.exports = {
  getPipelineId,

  logPipelineStarted: (total) => {
    internalPipelineId = uuidv4().slice(0, 8);
    logWithPipeline({
      logLevel: 'INFO',
      type: 'pipelineStatus',
      status: 'INPROGRESS',
      message: `Pipeline started with ${total} sites.`,
      details: { total },
    });
  },

  logPipelineFinished: (
    totalProcessed,
    pwaCount,
    noPwaCount,
    errorCount,
    savedPwaCount,
    executionTime
  ) => {
    logWithPipeline({
      logLevel: 'INFO',
      type: 'pipelineStatus',
      status: 'FINISHED',
      message: `Pipeline finished in ${executionTime}s — Total: ${totalProcessed}, PWA: ${pwaCount}, Saved: ${savedPwaCount}, Failed: ${noPwaCount}, Errors: ${errorCount}`,
      details: {
        totalProcessed,
        pwaCount,
        savedPwaCount,
        noPwaCount,
        errorCount,
        executionTime,
      },
    });
  },

  logPipelineError: (error) => {
    logWithPipeline({
      logLevel: 'ERROR',
      type: 'pipelineError',
      status: 'ERROR',
      message: error.message,
      details: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    });
  },

  logSiteStarted: (site) => {
    logWithPipeline({
      logLevel: 'INFO',
      type: 'siteProcess',
      site,
      status: 'STARTED',
      message: generateSiteMessage(site, 'NONE'),
    });
  },

  logSiteSuccess: (site) => {
    logWithPipeline({
      logLevel: 'INFO',
      type: 'siteProcess',
      site,
      status: 'PWA',
      message: generateSiteMessage(site, 'PWA'),
    });
  },

  logSiteFailed: (site) => {
    logWithPipeline({
      logLevel: 'INFO',
      type: 'siteProcess',
      site,
      status: 'NOPWA',
      message: generateSiteMessage(site, 'NOPWA'),
    });
  },

  logSiteError: (site, error) => {
    logWithPipeline({
      logLevel: 'ERROR',
      type: 'siteProcess',
      site,
      status: 'ERROR',
      message: generateSiteMessage(site, 'ERROR'),
      details: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    });
  },

  logSiteStepStarted: (site, step) => {
    logWithPipeline({
      logLevel: 'INFO',
      type: 'siteStep',
      site,
      step,
      status: 'INPROGRESS',
      message: generateSiteMessage(site, step, 'STARTED'),
    });
  },

  logSiteStepSuccess: (site, step, details) => {
    logWithPipeline({
      logLevel: 'INFO',
      type: 'siteStep',
      site,
      step,
      status: 'SUCCESS',
      message: generateSiteMessage(site, step, 'SUCCESS'),
      details: details || {},
    });
  },

  logSiteStepFailed: (site, step, details) => {
    logWithPipeline({
      logLevel: 'WARN',
      type: 'siteStep',
      site,
      step,
      status: 'FAILED',
      message: generateSiteMessage(site, step, 'FAILED'),
      details: details || {},
    });
  },

  logSiteStepError: (site, step, error) => {
    logWithPipeline({
      logLevel: 'ERROR',
      type: 'siteStep',
      site,
      step,
      status: 'ERROR',
      message: generateSiteMessage(site, step, 'ERROR'),
      details: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    });
  },

  logSiteStepTrace: (site, step, message, details) => {
    logWithPipeline({
      logLevel: 'TRACE',
      type: 'siteStep',
      site,
      step,
      message,
      details,
    });
  },
};
