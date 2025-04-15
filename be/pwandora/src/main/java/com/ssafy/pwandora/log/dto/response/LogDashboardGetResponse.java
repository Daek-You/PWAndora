package com.ssafy.pwandora.log.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
@Schema(description = "로그 대시보드 응답")
public class LogDashboardGetResponse {

	@Schema(description = "크롤러 전체 실행횟수")
	private Long totalRuns;

	@Schema(description = "크롤러 평균 시간")
	private Long AverageTime;
}
