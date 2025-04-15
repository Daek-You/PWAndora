package com.ssafy.pwandora.log.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.pwandora.log.dto.request.LogPipelineGetRequest;
import com.ssafy.pwandora.log.dto.request.LogSearchGetRequest;
import com.ssafy.pwandora.log.dto.response.LogDashboardGetResponse;
import com.ssafy.pwandora.log.dto.response.LogPipelineGetResponse;
import com.ssafy.pwandora.log.dto.response.LogSearchGetResponse;
import com.ssafy.pwandora.log.entity.Log;
import com.ssafy.pwandora.log.repository.LogRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Transactional
@Service
public class LogService {

	private final LogRepository logRepository;

	public Page<LogSearchGetResponse> searchLogs(LogSearchGetRequest request) {
		Page<Log> logPage = logRepository.searchLogs(request);
		return logPage
			.map(l -> LogSearchGetResponse.builder()
				.pipelineId(l.getPipelineId())
				.logLevel(l.getLogLevel())
				.type(l.getType())
				.status(l.getStatus())
				.step(l.getStep())
				.message(l.getMessage())
				.timestamp(l.getTimestamp())
				.siteId(l.getSite() != null ? l.getSite().getId() : null)
				.siteUrl(l.getSite() != null ? l.getSite().getUrl() : null)
				.details(l.getDetails())
				.build());
	}

	public LogDashboardGetResponse getLogDashboard() {
		Long totalRuns = logRepository.countUniquePipelineIds();
		Long averageTime = logRepository.calculateAveragePipelineDuration();

		return LogDashboardGetResponse.builder()
			.totalRuns(totalRuns)
			.AverageTime(averageTime)
			.build();
	}

	public List<LogPipelineGetResponse> getLogPipelines(LogPipelineGetRequest request) {
		return logRepository.getPipelines(request);
	}
}
