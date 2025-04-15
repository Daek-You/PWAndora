const workerManager = require('../infra/workerManager');

const { checkUrlAccessibility } = require('../inspection/checkStartUrl');
const { checkAiCensor } = require('../inspection/checkAiCensor');
const { checkPackagingFile } = require('../inspection/checkPackagingFiles');
const { checkSecurity } = require('../inspection/checkSecurity');
const { checkDisplayCompatibility } = require('../inspection/checkDisplayCompatibility');
const { getSiteStatusService } = require('../../services');
const { PipelineSteps } = require('../redis/enums/pipelineSteps');

const {
    logSiteStepStarted,
    logSiteStepSuccess,
    logSiteStepFailed,
} = require('../../utils/logging/loggerTemplates');

const step = PipelineSteps.INSPECTION;

const inspectPWA = async(site) => {
    logSiteStepStarted(site.id, step);
    const siteId = site.id;
    let browser;

    try {
        // 워커를 한 번만 생성하고 모든 검수 과정에서 공유
        browser = await workerManager.getWorker();
        if (!browser) throw new Error('브라우저 인스턴스를 생성할 수 없습니다.');

        const siteStatusService = getSiteStatusService();
        const appInfo = await siteStatusService.getTempData(siteId, 'appInfo');

        // 1. start_url 작동 여부
        console.log('start_url 작동 여부 검수 시작');
        const isUrlAccessible = await checkUrlAccessibility(site, appInfo.url, browser);

        // 2. 해상도별 스크린샷찍기
        console.log('해상도별 스크린샷찍기 검수 시작');
        const isDisplayCompatible = await checkDisplayCompatibility(site, appInfo, browser);

        // 3. AI Censor 검수
        console.log('AI Censor 검수 시작');
        const isAiCensorValid = await checkAiCensor(site);

        // 4. 패키징 파일 검수
        console.log('패키징 파일 검수 시작');
        const isPackagingFileValid = await checkPackagingFile(site);

        // 5. Security 검수 (HTTPS, CSP Header)
        console.log('Security 검수 시작');
        const isSecurityValid = await checkSecurity(site, browser);

        logSiteStepSuccess(site, step);
        return {
            isUrlAccessible,
            isDisplayCompatible,
            isAiCensorValid,
            isPackagingFileValid,
            isSecurityValid
        };
    } catch (error) {
        logSiteStepFailed(site, step, {
            reason: `PWA inspection failed: ${error.message}`
        });
        console.error('PWA 검수 중 에러 발생:', error);
        return false;
    } finally {
        if (browser) {
            try {
                await workerManager.releaseWorker(browser);
                console.log('검수용 워커 정상 종료');
            } catch (error) {
                console.error('워커 해제 실패:', error);
            }
        }
    }
}

module.exports = { inspectPWA };
