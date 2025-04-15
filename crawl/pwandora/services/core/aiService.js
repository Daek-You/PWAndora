const OpenAI = require('openai');
const { PWA_INFO_PROMPT } = require('../../data/PROMPT');
const { getSiteStatusService } = require('../../services');
const {
  logSiteStepStarted,
  logSiteStepFailed,
  logSiteStepTrace,
  logSiteStepSuccess,
} = require('../../utils/logging/loggerTemplates');
const { PipelineSteps } = require('../redis/enums/pipelineSteps');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const step = PipelineSteps.AI;

const generateInfoFromAI = async (site) => {
  logSiteStepStarted(site.id, step);
  const siteStatusService = getSiteStatusService();

  const id = site.id;

  const manifest = await siteStatusService.getTempData(id, 'manifest');
  const source = await siteStatusService.getTempData(id, 'mainPageData');

  if (!source || !manifest) {
    logSiteStepFailed(site, step, {
      reason: 'manifest or mainPageData missing from temp storage',
    });
    await siteStatusService.markFailed(site, step);
    return false;
  }

  const prompt = PWA_INFO_PROMPT.replace('{mainpage_source}', source).replace(
    '{manifest_json}',
    manifest
  );

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    logSiteStepTrace(site, step, 'OpenAI response received');

    const raw = response.choices[0].message.content;

    // 응답 파싱
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      logSiteStepFailed(site, step, {
        reason: 'OpenAI JSON parse failed',
      });
      await siteStatusService.markFailed(site, step);
      return;
    }

    if (parsed) {
      logSiteStepSuccess(site, step);
      await siteStatusService.setTempData(id, 'aiResponse', parsed);
      await siteStatusService.markSuccess(site, step);
    } else {
      await siteStatusService.markFailed(site, step);
    }

    return parsed;
  } catch (error) {
    logSiteStepFailed(site, step, {
      reason: error.message,
    });
    await siteStatusService.markFailed(site, step);
    return false;
  }
};

module.exports = { openai, generateInfoFromAI };
