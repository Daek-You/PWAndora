const HealthCheckScheduler = require('../../schedulers/healthCheck');
const { toKoreanISOString } = require('../processing/dateUtil');

const levelMap = {
  TRACE: 10,
  DEBUG: 20,
  INFO: 30,
  WARN: 40,
  ERROR: 50,
  FATAL: 60,
};

/**
 * 로그를 일관된 포맷으로 출력
 * @param {import('pino').Logger} logger
 * @param {Object} payload
 */
const log = (logger, payload = {}) => {
  const {
    pipelineId,
    logLevel = 'INFO',
    type,
    message,
    status,
    site,
    step,
    details,
  } = payload;

  const levelStr = logLevel.toUpperCase();
  const levelNum = levelMap[levelStr] ?? 30;

  const method =
    levelNum >= 60
      ? 'fatal'
      : levelNum >= 50
      ? 'error'
      : levelNum >= 40
      ? 'warn'
      : levelNum >= 30
      ? 'info'
      : levelNum >= 20
      ? 'debug'
      : 'trace';

  const logPayload = {
    pipelineId,
    type,
    status,
    step: step ?? undefined,
    site: site ? { id: site.id, url: site.url } : undefined,
    message: message || '(no message)',
    details: details ?? undefined,
    logLevel: levelStr,
    timestamp: toKoreanISOString(),
  };

  Object.keys(logPayload).forEach((key) => {
    if (logPayload[key] === undefined) delete logPayload[key];
  });

  logger[method](logPayload);

  try {
    HealthCheckScheduler.updateLastLogTime();
  } catch (e) {
    console.warn('HealthCheckScheduler 업데이트 실패:', e.message);
  }
};

module.exports = { log };
