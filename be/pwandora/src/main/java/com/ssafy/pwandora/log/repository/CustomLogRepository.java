package com.ssafy.pwandora.log.repository;

import java.util.List;

import org.springframework.data.domain.Page;

import com.ssafy.pwandora.log.dto.request.LogPipelineGetRequest;
import com.ssafy.pwandora.log.dto.request.LogSearchGetRequest;
import com.ssafy.pwandora.log.dto.response.LogPipelineGetResponse;
import com.ssafy.pwandora.log.entity.Log;

public interface CustomLogRepository {
	Page<Log> searchLogs(LogSearchGetRequest request);

	Long countUniquePipelineIds();

	Long calculateAveragePipelineDuration();

	List<LogPipelineGetResponse> getPipelines(LogPipelineGetRequest request);

	Long countSiteStepSuccess(String pipelineId);

	Long countSiteProcessPwa(String pipelineId);

	Long countErrorLogs(String pipelineId);
}
