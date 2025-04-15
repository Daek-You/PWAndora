package com.ssafy.pwandora.pwa.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class PwaTotalStatsGetResponse {

	@Schema(description = "수집된 총 사이트 수", example = "100")
	private Long siteCount;

	@Schema(description = "수집된 총 사이트 수 전날 대비 증감량", example = "5")
	private Long siteCountDelta;

	@Schema(description = "아직 확인되지 않은 사이트 수", example = "30")
	private Long noneSiteCount;

	@Schema(description = "아직 확인되지 않은 사이트 수 전날 대비 증감량", example = "-2")
	private Long noneSiteCountDelta;

	@Schema(description = "확인된 PWA 수", example = "50")
	private Long pwaCount;

	@Schema(description = "확인된 PWA 수 전날 대비 증감량", example = "3")
	private Long pwaCountDelta;

	@Schema(description = "확인 결과 PWA가 아닌 수", example = "20")
	private Long noPwaCount;

	@Schema(description = "확인 결과 PWA가 아닌 수 전날 대비 증감량", example = "1")
	private Long noPwaCountDelta;

	@Schema(description = "PWA 다운로드 횟수 총합", example = "5000")
	private Long totalDownloadCount;

	@Schema(description = "PWA 다운로드 횟수 총합 전날 대비 증감량", example = "100")
	private Long totalDownloadCountDelta;

	@Schema(description = "차단된 PWA 개수", example = "5")
	private Long blockedPwaCount;

	@Schema(description = "차단된 PWA 개수 전날 대비 증감량", example = "-1")
	private Long blockedPwaCountDelta;
}