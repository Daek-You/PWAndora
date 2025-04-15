const { parse } = require('tldts');

const getValidMainDomain = async (inputUrl) => {
  try {
    if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
      inputUrl = 'https://' + inputUrl;
    }
    const parsedUrl = new URL(inputUrl);
    const hostname = parsedUrl.hostname;
    const extracted = parse(hostname);
    if (!extracted.domain || !extracted.publicSuffix) {
      return `https://${hostname}`; // 파싱 실패 시 원래 도메인 사용
    }
    const recomposedDomain = `${extracted.domain}.${extracted.publicSuffix}`;
    // 중복 방지: recomposedDomain이 이미 hostname에 포함되어 있으면 hostname 사용
    if (
      hostname.length <= recomposedDomain.length ||
      hostname === recomposedDomain
    ) {
      return `https://${hostname}`;
    }
    return `https://${recomposedDomain}`;
  } catch (err) {
    console.error('도메인 추출 오류:', err);
    return null;
  }
};
module.exports = {
  getValidMainDomain,
};
