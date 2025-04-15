const { getSiteStatusService } = require('../../services');
const PwaStorageService = require('./pwaStorageService');
const {
  logSiteStepStarted,
  logSiteStepFailed,
} = require('../../utils/logging/loggerTemplates');
const { PipelineSteps } = require('../redis/enums/pipelineSteps');

const step = PipelineSteps.SAVE;

/**
 * 임시 저장소의 데이터를 검증 후 저장하고 정리합니다.
 */
const saveAndClearTempStorage = async (site) => {
  logSiteStepStarted(site.id, step);
  const { id: siteId } = site;
  const siteStatusService = getSiteStatusService();

  try {
    const tempData = await siteStatusService.getAllTempData(siteId);
    if (!tempData) {
      logSiteStepFailed(site, step, { reason: 'No temp data found' });
      await siteStatusService.markFailed(site, step);
      return false;
    }

    const requiredFields = {
      appId: tempData.appId,
      appInfo: tempData.appInfo,
      aiResponse: tempData.aiResponse,
      tizenPackaging: tempData.tizenPackaging,
      androidPackaging: tempData.androidPackaging,
      
      // screenshotLarge: tempData.screenshotLarge,
      // screenshotMedium: tempData.screenshotMedium,
      // screenshotSmall: tempData.screenshotSmall,
      // ai_censor_result: tempData.ai_censor_result,
      // https: tempData.security_result.details.isHttps ? 'true' : 'false',
      // csp: tempData.security_result.details.hasCsp ? 'true' : 'false',

      // crawled_status: tempData.crawled_status,
      // ai_censor_status: tempData.ai_censor_result.ai_suggestion_status,
      // packaging_status: tempData.packaging_status,
      // security_status: tempData.security_status,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      logSiteStepFailed(site, step, {
        reason: `Missing required fields: ${missingFields.join(', ')}`,
      });
      await siteStatusService.markFailed(site, step);
      return false;
    }

    const dataToSave = {
      siteId,
      screenshots: tempData.screenshots || [],
      ...requiredFields,
    };

    const result = await PwaStorageService.savePwaData(dataToSave);
    if (!result) {
      console.error('No data saved');
      logSiteStepFailed(site, step, { reason: 'No data saved' });
      await siteStatusService.markFailed(site, step);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    logSiteStepFailed(site, step, { reason: error.message });
    await siteStatusService.markFailed(site, step);
    return false;
  }
};

module.exports = { saveAndClearTempStorage };
