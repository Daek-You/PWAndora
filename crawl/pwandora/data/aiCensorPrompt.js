const AI_CENSOR_PROMPT = `주어진 웹사이트의 각 카테고리별 위험도를 0~100%로 평가해주세요.
각 카테고리별 평가 기준은 다음과 같습니다:

1. Child Endangerment (아동 위험)
- 아동 성착취/학대 관련 콘텐츠 존재 여부
- 아동을 대상으로 한 부적절한 상호작용 요소
- 아동 성착취/학대 관련 광고나 링크
- 아동을 대상으로 한 부적절한 콘텐츠 (과도한 폭력, 유해한 활동 등)

2. Inappropriate Content (부적절한 콘텐츠)
- 성적 콘텐츠나 외설적 콘텐츠 존재
- 혐오 발언이나 차별적 콘텐츠
- 과도한 폭력이나 위험한 활동 묘사
- 괴롭힘/협박 관련 콘텐츠

3. Financial Services (금융 서비스)
- 사기성 금융 상품/서비스 제공
- 불법 대출 서비스
- 투자 관련 허위 정보
- 금융 관련 허위 광고

4. Real-Money Gambling (실제 돈이 오가는 도박)
- 불법 도박 서비스 제공
- 미성년자 대상 도박 광고
- 허위 도박 광고
- 불법 복권/추첨 서비스

5. Illegal Activities (불법 활동)
- 불법 약물 거래/제조 관련 콘텐츠
- 미성년자 대상 약물/알코올/담배 관련 콘텐츠
- 불법 약물 제조 방법 제공
- 기타 불법 활동 조장

6. Health Content and Services (건강 콘텐츠)
- 허위 의료 정보 제공
- 처방전 없이 의약품 판매
- 미승인 의약품/보조제 판매
- 의료 기능 관련 허위 광고

7. Blockchain-based Content (블록체인 기반 콘텐츠)
- 불법 암호화폐 거래소
- 기기 내 암호화폐 채굴
- 허위 NFT/토큰 광고
- 불법 토큰 판매

8. AI-Generated Content (AI 생성 콘텐츠)
- AI 생성 콘텐츠의 부적절성
- 허위/기만적인 AI 생성 콘텐츠
- AI 생성 콘텐츠의 신뢰성
- AI 생성 콘텐츠의 유해성

웹사이트 분석:
메인 페이지 내용:
{mainpage_source}

Manifest.json:
{manifest_json}

각 카테고리별로 0~100 사이의 위험도를 평가해주시고, 그 이유를 간단히 설명해주세요.
모든 평가 내용은 255자 이내로 한 줄로 작성해주세요. 각 카테고리의 주요 위험 요소와 그 이유를 중심으로 작성해주세요.

다음 JSON 형식으로 응답해주세요:
{
  "categories_risk": {
    "child_endangerment_risk": {
      "child_endangerment": <int>,
      "child_endangerment_reason": "255자 이내로 한 줄로 아동 위험 관련 평가 내용을 작성해주세요."
    },
    "inappropriate_content_risk": {
      "inappropriate_content": <int>,
      "inappropriate_content_reason": "255자 이내로 한 줄로 부적절한 콘텐츠 관련 평가 내용을 작성해주세요."
    },
    "financial_service_risk": {
      "financial_service": <int>,
      "financial_service_reason": "255자 이내로 한 줄로 금융 서비스 관련 평가 내용을 작성해주세요."
    },
    "real_money_gambling_risk": {
      "real_money_gambling": <int>,
      "real_money_gambling_reason": "255자 이내로 한 줄로 실제 돈이 오가는 도박 관련 평가 내용을 작성해주세요."
    },
    "illegal_activity_risk": {
      "illegal_activity": <int>,
      "illegal_activity_reason": "255자 이내로 한 줄로 불법 활동 관련 평가 내용을 작성해주세요."
    },
    "health_content_service_risk": {
      "health_content_service": <int>,
      "health_content_service_reason": "255자 이내로 한 줄로 건강 콘텐츠 관련 평가 내용을 작성해주세요."
    },
    "blockchain_based_content_risk": {
      "blockchain_based_content": <int>,
      "blockchain_based_content_reason": "255자 이내로 한 줄로 블록체인 기반 콘텐츠 관련 평가 내용을 작성해주세요."
    },
    "ai_generated_content_risk": {
      "ai_generated_content": <int>,
      "ai_generated_content_reason": "255자 이내로 한 줄로 AI 생성 콘텐츠 관련 평가 내용을 작성해주세요."
    }
  },
  "overall_assessment": "255자 이내로 웹사이트의 전반적인 위험도를 평가해주세요. 가장 높은 위험도를 가진 카테고리와 그 이유를 중심으로 작성해주세요.",
  
  "ai_suggestion_status": "위에서 분석한 모든 카테고리의 위험도 점수, 각각의 평가 내용, 그리고 overall_assessment를 종합적으로 검토하여 위험도가 낮은 경우 "DONE" 또는 위험도가 높은 경우 "WARNING"을 판단해주세요."
}
`;

module.exports = { AI_CENSOR_PROMPT };