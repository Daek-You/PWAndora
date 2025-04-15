const { getSiteStatusService } = require('../../services');
const {
  logSiteStepStarted,
  logSiteStepSuccess,
  logSiteStepFailed,
} = require('../../utils/logging/loggerTemplates');
const { InspectionSteps } = require('../redis/enums/inspectionSteps');

const step = InspectionSteps.CHECK_PACKAGING_FILES;

const checkPackagingFile = async (site) => {
  logSiteStepStarted(site, step);
  const siteId = site.id;
  const siteStatusService = getSiteStatusService();

  try {
    const tizenPackagingData = await siteStatusService.getTempData(
      siteId,
      'tizenPackaging'
    );
    const androidPackagingData = await siteStatusService.getTempData(
      siteId,
      'androidPackaging'
    );

    const isTizen = tizenPackagingData && tizenPackagingData.download_url;
    const isAndroid = androidPackagingData && androidPackagingData.download_url;

    const status = isTizen || isAndroid ? 'DONE' : 'WARNING';

    await siteStatusService.setTempData(siteId, 'packaging_status', status);
    logSiteStepSuccess(site, step);
    return isTizen || isAndroid;
  } catch (error) {
    logSiteStepFailed(site, step, {
      reason: 'Failed to check packaging files',
    });

    console.error('패키징 파일 검사 중 에러:', error);
    await siteStatusService.setTempData(siteId, 'packaging_status', 'WARNING');
    return false;
  }
};

module.exports = { checkPackagingFile };
