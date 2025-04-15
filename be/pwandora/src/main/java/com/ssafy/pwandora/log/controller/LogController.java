package com.ssafy.pwandora.log.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.pwandora.global.dto.CommonPageResponse;
import com.ssafy.pwandora.log.dto.request.LogPipelineGetRequest;
import com.ssafy.pwandora.log.dto.request.LogSearchGetRequest;
import com.ssafy.pwandora.log.dto.response.LogDashboardGetResponse;
import com.ssafy.pwandora.log.dto.response.LogPipelineGetResponse;
import com.ssafy.pwandora.log.dto.response.LogSearchGetResponse;
import com.ssafy.pwandora.log.service.LogService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogController {

	private final LogService logService;

	@Operation(summary = "로그 검색 조회",
		description = "로그 에 대해 검색합니다. "
			+ "기본값 : page=0, size=20, sortCriteria=timestamp, sortDirection=DESC 로 설정되어 있습니다. "
			+ "swagger 에서 sortCriteria=createdAt 이 기본값으로 보이겠지만, 서버에서는 timestamp 로 고정입니다."
	)
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@GetMapping("/search")
	public CommonPageResponse<LogSearchGetResponse> searchLogs(LogSearchGetRequest request) {
		return CommonPageResponse.from(logService.searchLogs(request));
	}

	@Operation(summary = "로그 크롤러 대시보드 조회",
		description = "로그 기반으로 크롤러 대시보드 페이지 내용을 조회합니다."
	)
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@GetMapping("/dashboard")
	public ResponseEntity<LogDashboardGetResponse> getPwaById() {

		LogDashboardGetResponse response = logService.getLogDashboard();
		return ResponseEntity.ok(response);
	}

	@Operation(summary = "파이프라인별 조회",
		description = "파이프라인별로 정보를 조회합니다."
	)
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@GetMapping("/pipelines")
	public ResponseEntity<List<LogPipelineGetResponse>> getPipelines(LogPipelineGetRequest request) {

		List<LogPipelineGetResponse> response = logService.getLogPipelines(request);
		return ResponseEntity.ok(response);
	}
}
