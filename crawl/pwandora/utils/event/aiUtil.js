const { openai } = require('../../services/core/aiService');
const path = require('path');

async function summarizeEvent(ocrText, appName) {
  const prompt = `
다음은 ${appName} 사이트의 이벤트 페이지에서 추출한 텍스트입니다.
이 이벤트의 핵심 내용을 요약하고, 가능한 경우 이벤트 시작일(startAt)과 종료일(endAt)을 "YYYY-MM-DD" 형식으로 추출해 주세요.

조건:
- title_ko는 15자 이내의 자연스러운 한국어 문장
- title_en은 title_ko의 자연스러운 영어 번역
- description_ko는 100자 이내의 자연스러운 한국어 문장
- description_en은 description_ko의 자연스러운 영어 번역
- startAt, endAt은 YYYY-MM-DD 형식 또는 null

+ 응답은 반드시 **JSON만** 포함해야 하며, json 또는 기타 텍스트는 포함하지 마세요.

텍스트:
${ocrText}

응답 형식:
{
  "title_ko": "...",
  "title_en": "...",
  "description_ko": "...",
  "description_en": "...",
  "startAt": "YYYY-MM-DD" 또는 null,
  "endAt": "YYYY-MM-DD" 또는 null,
}
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  const jsonOnly = content.replace(/```json|```/g, '').trim();

  return JSON.parse(jsonOnly);
}

module.exports = { summarizeEvent };
