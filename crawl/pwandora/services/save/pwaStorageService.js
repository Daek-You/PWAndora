const PwaRepository = require('../../repositories/PwaRepository');
const PwaCategoryRepository = require('../../repositories/PwaCategoryRepository');
const ContentRepository = require('../../repositories/ContentRepository');
const ScreenshotRepository = require('../../repositories/ScreenshotRepository');
const PwaFileRepository = require('../../repositories/PwaFileRepository');
const SiteRepository = require('../../repositories/SiteRepository');
const DisplayRepository = require('../../repositories/DisplayRepository');
const AcceptanceChecklistRepository = require('../../repositories/AcceptanceChecklistRepository');
const SecurityRepository = require('../../repositories/SecurityRepository');
const ContentModerationRepository = require('../../repositories/ContentModerationRepository');
const ContentModerationReasoningRepository = require('../../repositories/ContentModerationReasoningRepository');
const { getSiteStatusService } = require('../../services');
const { sequelize } = require('../../config/dbConfig');
const {
  logSiteStepTrace,
  logSiteStepFailed,
  logSiteStepSuccess,
} = require('../../utils/logging/loggerTemplates');

class PwaStorageService {
  constructor() {
    if (!PwaStorageService.instance) {
      PwaStorageService.instance = this;
    }
    return PwaStorageService.instance;
  }

  validAgeLimits = [
    'ALL',
    'EIGHTEEN_PLUS',
    'SEVEN_PLUS',
    'SIXTEEN_PLUS',
    'THREE_PLUS',
    'TWELVE_PLUS',
    'UNRATED',
  ];

  async savePwaData(item) {
    const step = 'savePWA';
    const siteStatusService = getSiteStatusService();
    const site = { id: item.siteId, url: item.appInfo?.url };

    const transaction = await sequelize.transaction();
    try {
      const pwaEntry = await PwaRepository.insertOrUpdate(
        {
          app_id: item.appId,
          icon_image: item.appInfo.icon,
          website_url: item.appInfo.start_url || item.appInfo.url,
          company: item.aiResponse.company || item.appInfo.name,
          developer_site: item.aiResponse?.developer_site,
          age_limit:
            this.validAgeLimits[item.aiResponse.age_limit] || 'UNRATED',
        },
        transaction
      );

      const pwa_id = pwaEntry.id;

      await SiteRepository.updatePwaId(item.siteId, pwa_id, transaction);

      if (Array.isArray(item.aiResponse.categories)) {
        await PwaCategoryRepository.bulkInsert(
          item.aiResponse.categories.map((categoryId) => ({
            pwa_id,
            category_id: categoryId,
          })),
          transaction
        );
      }

      // const categoriesRisk = item.ai_censor_result.categories_risk;
      // const moderationData = {
      //   pwa_id,
      //   child_endangerment: categoriesRisk.child_endangerment_risk?.child_endangerment ?? false,
      //   inappropriate_content: categoriesRisk.inappropriate_content_risk?.inappropriate_content ?? false,
      //   financial_service: categoriesRisk.financial_service_risk?.financial_service ?? false,
      //   real_money_gambling: categoriesRisk.real_money_gambling_risk?.real_money_gambling ?? false,
      //   illegal_activity: categoriesRisk.illegal_activity_risk?.illegal_activity ?? false,
      //   health_content_service: categoriesRisk.health_content_service_risk?.health_content_service ?? false,
      //   blockchain_based_content: categoriesRisk.blockchain_based_content_risk?.blockchain_based_content ?? false,
      //   ai_generated_content: categoriesRisk.ai_generated_content_risk?.ai_generated_content ?? false
      // };
      // await ContentModerationRepository.insertOrUpdate(moderationData, transaction);

      // const displayData = {
      //   pwa_id,
      //   image_url_large: item.screenshotLarge,
      //   image_url_medium: item.screenshotMedium?.replace('/7inch', 'or7inch'),
      //   image_url_small: item.screenshotSmall,
      //   is_large: false,
      //   is_medium: false,
      //   is_small: false,
      //   is_medium_small: false
      // };
      // await DisplayRepository.insertOrUpdate(displayData, transaction);

      // let https;
      // let csp;

      // if (item.https === 'true') {
      //   https = true;
      // } else {
      //   https = false;
      // }

      // if (item.csp === 'true') {
      //   csp = true;
      // } else {
      //   csp = false;
      // }

      // const securityData = {
      //   pwa_id,
      //   https,
      //   csp
      // };
      // await SecurityRepository.insertOrUpdate(securityData, transaction);

      const contentData = [
        {
          pwa_id,
          language_id: 1,
          name: item.aiResponse.name_en,
          summary: item.aiResponse.summary_en,
          description: item.aiResponse.description_en,
        },
        {
          pwa_id,
          language_id: 2,
          name: item.aiResponse.name_ko,
          summary: item.aiResponse.summary_ko,
          description: item.aiResponse.description_ko,
        },
      ];
      await ContentRepository.bulkInsert(contentData, transaction);
      logSiteStepTrace(site, step, 'Localized content inserted');

      if (Array.isArray(item.screenshots) && item.screenshots.length) {
        const screenshotData = item.screenshots.map((s, i) => ({
          pwa_id,
          image_url: s,
          screenshot_order: i,
        }));
        await ScreenshotRepository.bulkInsert(screenshotData, transaction);
        logSiteStepTrace(
          site,
          step,
          `Inserted ${item.screenshots.length} screenshots`
        );
      }

      // // content moderation reasoning 데이터 저장
      // const reasoningData = {
      //   pwa_id,
      //   child_endangerment_reason: categoriesRisk.child_endangerment_risk?.child_endangerment_reason,
      //   inappropriate_content_reason: categoriesRisk.inappropriate_content_risk?.inappropriate_content_reason,
      //   financial_service_reason: categoriesRisk.financial_service_risk?.financial_service_reason,
      //   real_money_gambling_reason: categoriesRisk.real_money_gambling_risk?.real_money_gambling_reason,
      //   illegal_activity_reason: categoriesRisk.illegal_activity_risk?.illegal_activity_reason,
      //   health_content_service_reason: categoriesRisk.health_content_service_risk?.health_content_service_reason,
      //   blockchain_based_content_reason: categoriesRisk.blockchain_based_content_risk?.blockchain_based_content_reason,
      //   ai_generated_content_reason: categoriesRisk.ai_generated_content_risk?.ai_generated_content_reason,
      //   overall_assessment: item.ai_censor_result.overall_assessment
      // };

      // await ContentModerationReasoningRepository.insertOrUpdate(reasoningData, transaction);
      // logSiteStepTrace(site, step, 'Inserted content moderation reasoning data');

      // // acceptance checklist 데이터 저장
      // const checklistData = {
      //   pwa_id,
      //   crawled_status: item.crawled_status || 'NEED_CONFIRM',
      //   display_status: 'NEED_CONFIRM',
      //   screenshot_status: 'NEED_CONFIRM',
      //   ai_suggestion_status: 'NEED_CONFIRM',
      //   ai_censor_status: item.ai_censor_status || 'NEED_CONFIRM',
      //   packaging_status: item.packaging_status || 'NEED_CONFIRM',
      //   lighthouse_status: 'NEED_CONFIRM',
      //   security_status: item.security_status || 'NEED_CONFIRM'
      // };

      // await AcceptanceChecklistRepository.insertOrUpdate(checklistData, transaction);
      // logSiteStepTrace(site, step, 'Inserted acceptance checklist data');

      const fileData = [];
      if (item.tizenPackaging.download_url) {
        fileData.push({
          pwa_id,
          download_url: item.tizenPackaging.download_url,
          file_size: item.tizenPackaging.file_size,
          file_type: 'WGT',
        });
      }

      if (item.androidPackaging.download_url) {
        fileData.push({
          pwa_id,
          download_url: item.androidPackaging.download_url,
          file_size: item.androidPackaging.file_size,
          file_type: 'APK',
        });
      }

      if (fileData.length) {
        await PwaFileRepository.bulkInsert(fileData, transaction);
        logSiteStepTrace(site, step, 'Inserted packaged file metadata');
      }

      await transaction.commit();
      await siteStatusService.setTempData(site.id, 'pwaId', pwa_id);
      await siteStatusService.markSuccess(site, step);
      return true;
    } catch (error) {
      console.error('저장 실패. 상세 에러:', {
        message: error.message,
        stack: error.stack,
        sql: error.sql,
        parameters: error.parameters,
      });
      await transaction.rollback();
      await siteStatusService.markFailed(site, step);
      throw error;
    }
  }
}

const instance = new PwaStorageService();
Object.freeze(instance);
module.exports = instance;
