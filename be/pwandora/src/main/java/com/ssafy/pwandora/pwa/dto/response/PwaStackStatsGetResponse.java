package com.ssafy.pwandora.pwa.dto.response;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class PwaStackStatsGetResponse {

	@Schema(description = "해당하는 날짜")
	private LocalDate date;

	@Schema(description = "아직 확인되지 않은 누적 사이트 수", example = "30")
	private Long noneSiteStackCount;

	@Schema(description = "확인된 PWA 누적 수", example = "50")
	private Long pwaStackCount;

	@Schema(description = "확인 결과 PWA가 아닌 누적 수", example = "20")
	private Long noPwaStackCount;

	@Schema(description = "PWA 다운로드 횟수 누적 총합", example = "5000")
	private Long totalDownloadStackCount;

	@Schema(description = "차단된 PWA 누적 개수", example = "5")
	private Long blockedPwaStackCount;
}
