package com.ssafy.pwandora.pwa.dto.response;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class PwaDailyStatsGetResponse {

	@Schema(description = "해당하는 날짜")
	private LocalDate date;

	@Schema(description = "아직 확인되지 않은 사이트 수", example = "30")
	private Long noneSiteCount;

	@Schema(description = "확인된 PWA 수", example = "50")
	private Long pwaCount;

	@Schema(description = "확인 결과 PWA가 아닌 수", example = "20")
	private Long noPwaCount;

	@Schema(description = "PWA 다운로드 횟수 총합", example = "5000")
	private Long totalDownloadCount;

	@Schema(description = "차단된 PWA 개수", example = "5")
	private Long blockedPwaCount;
}
