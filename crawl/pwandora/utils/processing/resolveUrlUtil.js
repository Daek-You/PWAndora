const axios = require('axios');

//상대경로 또는 절대 URL을 받아 유효한 URL을 순차적으로 시도하며 성공하는 URL을 반환
const resolveWorkingUrl = async (src, bases = []) => {
  if (!src) return null;

  const candidates = [];

  // 절대 URL인 경우 우선 시도
  if (src.startsWith('http')) {
    candidates.push(src);
  }

  // 상대경로이면 base URL들과 조합하여 후보 생성
  for (const base of bases) {
    try {
      const absolute = new URL(src, base).href;
      if (!candidates.includes(absolute)) {
        candidates.push(absolute);
      }
    } catch (_) {
      // 무시
    }
  }

  // 각 URL에 대해 HEAD 요청으로 접근 가능 여부 확인
  for (const url of candidates) {
    try {
      const res = await axios.head(url, { timeout: 5000 });
      if (res.status >= 200 && res.status < 400) {
        return url;
      }
    } catch (_) {
      continue;
    }
  }

  return null;
};

module.exports = { resolveWorkingUrl };
