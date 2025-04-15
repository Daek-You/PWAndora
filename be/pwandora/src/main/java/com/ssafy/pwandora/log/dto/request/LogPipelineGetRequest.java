package com.ssafy.pwandora.log.dto.request;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = false)
@Data
@Schema(description = "파이프라인 요청")
public class LogPipelineGetRequest {

	@Schema(description = "시작 시간", example = "2024-03-01T12:00:00")
	private LocalDateTime timeStart;

	@Schema(description = "마지막 시간", example = "2024-03-02T12:00:00")
	private LocalDateTime timeEnd;

}
