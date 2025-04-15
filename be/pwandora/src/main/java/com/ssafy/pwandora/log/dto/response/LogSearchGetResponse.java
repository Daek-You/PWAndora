package com.ssafy.pwandora.log.dto.response;

import java.time.LocalDateTime;
import java.util.Map;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
@Schema(description = "로그 검색 조회 응답")
public class LogSearchGetResponse {

	@Schema(description = "파이프라인 id")
	private String pipelineId;

	@Schema(description = "로그 레벨")
	private String logLevel;

	@Schema(description = "로그 타입")
	private String type;

	@Schema(description = "로그 상태")
	private String status;

	@Schema(description = "로그 스텝")
	private String step;

	@Schema(description = "로그 메세지")
	private String message;

	@Schema(description = "로그 타임스탬프")
	private LocalDateTime timestamp;

	@Schema(description = "사이트 ID")
	private Long siteId;

	@Schema(description = "사이트 URL")
	private String siteUrl;

	@Schema(description = "추가 세부 정보")
	private Map<String, Object> details;
}
