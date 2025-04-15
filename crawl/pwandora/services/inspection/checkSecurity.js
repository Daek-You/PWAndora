const { getSiteStatusService } = require('../../services');
const { 
    logSiteStepSuccess,
    logSiteStepFailed,
} = require('../../utils/logging/loggerTemplates');
const { InspectionSteps } = require('../redis/enums/inspectionSteps');

const step = InspectionSteps.CHECK_SECURITY;

// 5. Security 검수 (HTTPS, CSP Header)
const checkSecurity = async (site, sharedBrowser) => {
    logSiteStepSuccess(site, step);
    const siteStatusService = getSiteStatusService();

    if (!site || !sharedBrowser) {
        logSiteStepFailed(site, step, {
            reason: 'Required parameters missing: site or browser instance'
        });
        return {
            isSecure: false,
            details: {
                isHttps: false,
                hasCsp: false,
            },
        };
    }

    try {
        // HTTPS 프로토콜 검사
        const url = new URL(site.url);
        const isHttps = url.protocol === 'https:';

        let context, page;
        try {
            // 브라우저 컨텍스트 초기화
            context = await sharedBrowser.newContext({
                ignoreHTTPSErrors: false  // SSL/TLS 인증서 에러 무시하지 않음
            });
            page = await context.newPage();
            
            // 페이지 로드 및 CSP 헤더 검사
            const response = await page.goto(site.url, {
                waitUntil: 'domcontentloaded',  // DOM 로드 완료 시점까지만 대기
                timeout: 10000  // 10초 타임아웃
            });

            // CSP 헤더 확인
            const securityHeaders = response.headers();
            const hasCsp = !!securityHeaders['content-security-policy'];

            const result = {
                isSecure: isHttps && hasCsp,
                details: {
                    isHttps,
                    hasCsp,
                }
            };
            
            await siteStatusService.setTempData(site.id, 'security_status', result.isSecure ? 'DONE' : 'WARNING');
            await siteStatusService.setTempData(site.id, 'security_result', result);
            logSiteStepSuccess(site, step);
            return result;
        } finally {
            // 리소스 정리
            if (page) await page.close().catch(() => {});
            if (context) await context.close().catch(() => {});
        }
    } catch (error) {
        console.error('보안 검사 실패:', error);
        const result = {
            isSecure: false,
            details: {
                isHttps: false,
                hasCsp: false,
            },
            error: error.message
        };
        
        await siteStatusService.setTempData(site.id, 'security_status', 'WARNING');
        await siteStatusService.setTempData(site.id, 'security_result', result);
        
        logSiteStepSuccess(site, step);
        return result;
    }
};

module.exports = { checkSecurity };
