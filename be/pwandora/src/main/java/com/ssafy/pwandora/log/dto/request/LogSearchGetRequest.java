package com.ssafy.pwandora.log.dto.request;

import java.time.LocalDateTime;

import com.ssafy.pwandora.global.dto.CommonPageRequest;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = false)
@Data
@Schema(description = "로그 검색 요청")
public class LogSearchGetRequest extends CommonPageRequest {

	@Schema(description = "파이르라인 고유 id", example = "s345278")
	private String pipelineId;

	@Schema(description = "시작 시간", example = "2024-03-01T12:00:00")
	private LocalDateTime timeStart;

	@Schema(description = "마지막 시간", example = "2024-03-02T12:00:00")
	private LocalDateTime timeEnd;

	@Schema(description = "로그 레벨", example = "ERROR")
	private String logLevel;

	@Schema(description = "로그 타입", example = "siteStep")
	private String type;

	@Schema(description = "스텝", example = "checkPWA")
	private String step;

	@Schema(description = "해당 스텝 상태 정보", example = "FAILED")
	private String status;

	@Schema(description = "메세지 내용", example = "s345278")
	private String message;

	@Schema(description = "사이트 Id", example = "345278")
	private Long siteId;

	@Schema(description = "사이트 url", example = "https://mersinbarosu.org.tr")
	private String siteUrl;
}
