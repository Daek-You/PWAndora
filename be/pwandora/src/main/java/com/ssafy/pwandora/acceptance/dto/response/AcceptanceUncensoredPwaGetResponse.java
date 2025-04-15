package com.ssafy.pwandora.acceptance.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
// 아직 검수되지 않은 앱 목록
public class AcceptanceUncensoredPwaGetResponse {
    private Integer id;         // pwa_id
    private String name;        // Content 테이블에서 가져온 영어 앱 이름
    private String webSiteUrl;  // Lighthouse API 호출에 사용하기 위한 URL
}
