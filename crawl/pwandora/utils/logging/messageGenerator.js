/**
 * 사이트 단계/상태에 따라 표준 메시지를 생성합니다.
 * @param {number} siteId
 * @param {string} siteUrl
 * @param {string} step
 * @param {'STARTED' | 'SUCCESS' | 'FAILED' | 'ERROR' | 'PWA' | 'NOPWA' | 'NONE'} status
 * @returns {string}
 */
const generateSiteMessage = (site, status, step) => {
  const statusMap = {
    STARTED: 'started',
    SUCCESS: 'succeeded',
    FAILED: 'failed',
    ERROR: 'errored',
    PWA: 'confirmed as PWA',
    NOPWA: 'confirmed as not PWA',
    NONE: 'processing started',
  };

  const statusText = statusMap[status] || status?.toLowerCase?.() || 'unknown';

  // step이 없는 경우
  if (!step || step === 'NONE') {
    return `[s${site.id}/${site.url}] Site ${statusText}.`;
  }

  return `[s${site.id}/${site.url}] ${step} ${statusText}.`;
};

module.exports = { generateSiteMessage };
