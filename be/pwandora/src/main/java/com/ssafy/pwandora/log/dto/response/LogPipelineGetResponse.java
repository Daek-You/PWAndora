package com.ssafy.pwandora.log.dto.response;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
@Schema(description = "파이프라인 응답")
public class LogPipelineGetResponse {

	@Schema(description = "파이프라인 고유 id")
	private String pipelineId;

	@Schema(description = "파이프라인 시작 시간")
	private LocalDateTime inProgressTimestamp;

	@Schema(description = "파이프라인 종료 시간")
	private LocalDateTime finishedTimestamp;

	@Schema(description = "저장된 PWA 개수")
	private Long savedPwaCount = 0L;

	@Schema(description = "총 처리된 사이트 수")
	private Long totalProcessed = 0L;

	@Schema(description = "PWA 사이트 개수")
	private Long pwaCount = 0L;

	@Schema(description = "에러 발생 개수")
	private Long errorCount = 0L;

	@Schema(description = "실행 시간 (단위: 초)")
	private Long executionTime;

	@Schema(description = "PWA 가 아닌 사이트 수")
	private Long noPwaCount = 0L;
}
