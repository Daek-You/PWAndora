const OpenAI = require('openai');
const { AI_CENSOR_PROMPT } = require('../../data/aiCensorPrompt');
const { getSiteStatusService } = require('../../services');
const {
  logSiteStepStarted,
  logSiteStepSuccess,
  logSiteStepFailed,
} = require('../../utils/logging/loggerTemplates');
const { InspectionSteps } = require('../redis/enums/inspectionSteps');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const step = InspectionSteps.CHECK_AI_CENSOR;

// AI 분석 함수
async function checkAiCensor(site) {
  logSiteStepStarted(site, step);
  const siteId = site.id;

  const siteStatusService = getSiteStatusService();

  const manifest = await siteStatusService.getTempData(siteId, 'manifest');
  const source = await siteStatusService.getTempData(siteId, 'mainPageData');

  const prompt = AI_CENSOR_PROMPT.replace('{manifest_json}', manifest).replace(
    '{mainpage_source}',
    source
  );

  try {
    // OpenAI API 호출
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // 응답 파싱
    const raw = response.choices[0].message.content;

    let result;
    try {
      // 마크다운 포맷팅이 있다면 제거
      const cleanContent = raw.replace(/```json\n?|\n?```/g, '').trim();
      result = JSON.parse(cleanContent);
    } catch (parseError) {
      logSiteStepFailed(site, step, {
        reason: 'Failed to parse JSON response from AI',
      });
      console.error('JSON 파싱 실패:', parseError.message);
      return false;
    }

    await siteStatusService.setTempData(siteId, 'ai_censor_result', result);
    logSiteStepSuccess(site, step);
    return result;
  } catch (error) {
    logSiteStepFailed(site, step, {
      reason: 'Failed to analyze with AI',
    });
    console.error('분석 실패:', error.message);
    return false;
  }
}

module.exports = { checkAiCensor };
