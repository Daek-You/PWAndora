const {
  tizenPackaging,
  androidPackaging,
} = require('../core/packagingService');
const { generateInfoFromAI } = require('../core/aiService');
const { generateScreenshots } = require('../core/screenshotService');
const { inspectPWA } = require('../core/inspectionService');
const { abortableTask } = require('../../utils/processing/taskWrapper');
const { saveAndClearTempStorage } = require('../save/pwaSaveService');
const { logSiteStepStarted } = require('../../utils/logging/loggerTemplates');
const { PipelineSteps } = require('../redis/enums/pipelineSteps');
const processAppInfo = async (site) => {
  try {
    const tasks = [
      abortableTask(PipelineSteps.TIZEN, tizenPackaging, site),
      abortableTask(PipelineSteps.ANDROID, androidPackaging, site),
      abortableTask(PipelineSteps.SCREENSHOT, generateScreenshots, site),
    ];

    try {
      console.log(`[${site.id}] 패키징 및 스크린샷 작업 시작`);
      await Promise.all(tasks);
      console.log(`[${site.id}] 패키징 및 스크린샷 작업 완료`);
    } catch (error) {
      console.error(`[${site.id}] 패키징/스크린샷 작업 실패:`, error);
      throw new Error(`패키징/스크린샷 실패: ${error.message}`);
    }

    console.log(`[${site.id}] AI 정보 생성 단계 시작`);
    try {
      const aiResult = await generateInfoFromAI(site);
      if (!aiResult) {
        console.error(`[${site.id}] AI 정보 생성 실패: 결과 없음`);
        throw new Error('AI 정보 생성 실패');
      }
      console.log(`[${site.id}] AI 정보 생성 완료`);
    } catch (error) {
      console.error(`[${site.id}] AI 정보 생성 중 에러:`, error);
      throw new Error(`AI 정보 생성 실패: ${error.message}`);
    }

    // console.log(`[${site.id}] PWA 검수 단계 시작`);
    // try {
    //   const inspectionResult = await inspectPWA(site);
    //   if (!inspectionResult) {
    //     console.error(`[${site.id}] PWA 검수 실패: 결과 없음`);
    //     throw new Error('PWA 검수 실패');
    //   }
    //   console.log(`[${site.id}] PWA 검수 완료`);
    // } catch (error) {
    //   console.error(`[${site.id}] PWA 검수 중 에러:`, error);
    //   throw new Error(`PWA 검수 실패: ${error.message}`);
    // }

    console.log(`[${site.id}] PWA 저장 단계 시작`);
    try {
      const saveResult = await saveAndClearTempStorage(site);
      if (!saveResult) {
        console.error(`[${site.id}] PWA 저장 실패: 결과 없음`);
        throw new Error('PWA 저장 실패');
      }
      console.log(`[${site.id}] PWA 저장 완료`);
    } catch (error) {
      console.error(`[${site.id}] PWA 저장 중 에러:`, error);
      throw new Error(`PWA 저장 실패: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error(`[${site.id}] processAppInfo 전체 실패:`, {
      errorMessage: error.message,
      stack: error.stack
    });
    throw error; // 원본 에러를 그대로 전파
  }
};

module.exports = { processAppInfo };
