package com.ssafy.pwandora.log.repository;

import java.io.IOException;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.stereotype.Repository;

import com.ssafy.pwandora.log.dto.request.LogPipelineGetRequest;
import com.ssafy.pwandora.log.dto.request.LogSearchGetRequest;
import com.ssafy.pwandora.log.dto.response.LogPipelineGetResponse;
import com.ssafy.pwandora.log.entity.Log;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.RangeQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.TermQuery;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CustomLogRepositoryImpl implements CustomLogRepository {

	private final ElasticsearchOperations elasticsearchOperations;
	private final ElasticsearchClient elasticsearchClient;

	@Override
	public Page<Log> searchLogs(LogSearchGetRequest request) {

		Criteria criteria = new Criteria();

		if (request.getPipelineId() != null && !request.getPipelineId().isEmpty()) {
			criteria = criteria.and("pipelineId").is(request.getPipelineId());
		}
		if (request.getLogLevel() != null && !request.getLogLevel().isEmpty()) {
			criteria = criteria.and("logLevel").is(request.getLogLevel());
		}
		if (request.getType() != null && !request.getType().isEmpty()) {
			criteria = criteria.and("type").is(request.getType());
		}
		if (request.getStatus() != null && !request.getStatus().isEmpty()) {
			criteria = criteria.and("status").is(request.getStatus());
		}
		if (request.getTimeStart() != null && request.getTimeEnd() != null) {
			criteria = criteria.and("timestamp").greaterThanEqual(request.getTimeStart());
		}

		if (request.getTimeEnd() != null && request.getTimeStart() != null) {
			criteria = criteria.and("timestamp").lessThanEqual(request.getTimeEnd());
		}

		if (request.getMessage() != null && !request.getMessage().isEmpty()) {
			criteria = criteria.and("message").matches(request.getMessage());
		}
		if (request.getSiteId() != null) {
			criteria = criteria.and("site.id").is(request.getSiteId());
		}
		if (request.getSiteUrl() != null && !request.getSiteUrl().isEmpty()) {
			criteria = criteria.and("site.url").is(request.getSiteUrl());
		}

		CriteriaQuery query = new CriteriaQuery(criteria);
		Pageable pageable = request.toPageableWithCriteria("timestamp"); // elasticsearch 에 맞는 timestamp 기준 정렬 넣어주기
		query.setPageable(pageable);

		SearchHits<Log> searchHits = elasticsearchOperations.search(query, Log.class);
		List<Log> logs = searchHits.map(SearchHit::getContent).toList();

		return new PageImpl<>(logs, pageable, searchHits.getTotalHits());
	}

	@Override
	public Long countUniquePipelineIds() {
		try {
			// Elasticsearch 검색 요청 생성
			SearchRequest request = SearchRequest.of(s -> s
				.index("express-logs-*") // 날짜별 인덱스 포함
				.query(q -> q
					.term(t -> t
						.field("type.keyword")
						.value("pipelineStatus") // type = "pipelineStatus" 필터링
					)
				)
				.aggregations("unique_pipeline_count", a -> a
					.cardinality(c -> c.field("pipelineId.keyword")) // pipelineId의 고유 개수 계산
				)
			);

			// Elasticsearch 검색 요청 실행
			SearchResponse<Void> response = elasticsearchClient.search(request, Void.class);

			// Aggregation 결과 가져오기
			return response.aggregations()
				.get("unique_pipeline_count")
				.cardinality()
				.value();
		} catch (IOException e) {
			throw new RuntimeException("Elasticsearch에서 pipelineId 고유 개수 조회 중 오류 발생", e);
		}
	}

	@Override
	public Long calculateAveragePipelineDuration() {
		try {
			// Elasticsearch 검색 요청
			SearchRequest request = SearchRequest.of(s -> s
				.index("express-logs-*")
				.query(q -> q.term(t -> t.field("type.keyword").value("pipelineStatus"))) // type = "pipelineStatus"
				.size(10000) // 최대 10,000개 데이터 가져오기
			);

			// Elasticsearch 실행
			SearchResponse<Map> response = elasticsearchClient.search(request, Map.class);

			Map<String, Long> inProgressTimestamps = new HashMap<>();
			Map<String, Long> finishedTimestamps = new HashMap<>();

			// 검색된 문서 처리
			for (Hit<Map> hit : response.hits().hits()) {
				Map<String, Object> source = hit.source();
				if (source == null)
					continue;

				String pipelineId = (String)source.get("pipelineId");
				String status = (String)source.get("status");
				String timestampStr = (String)source.get("timestamp");

				if (pipelineId == null || status == null || timestampStr == null)
					continue;

				// ISO 8601 -> Unix Timestamp 변환
				long timestamp = Instant.parse(timestampStr).toEpochMilli();

				if (status.equals("INPROGRESS")) {
					inProgressTimestamps.put(pipelineId, timestamp);
				} else if (status.equals("FINISHED")) {
					finishedTimestamps.put(pipelineId, timestamp);
				}
			}

			// 실행 시간 계산
			long totalDuration = 0L;
			int count = 0;

			for (String pipelineId : inProgressTimestamps.keySet()) {
				if (finishedTimestamps.containsKey(pipelineId)) {
					long duration =
						(finishedTimestamps.get(pipelineId) - inProgressTimestamps.get(pipelineId)) / 1000; // 초 단위
					if (duration > 0) { // 음수 방지
						totalDuration += duration;
						count++;
					}
				}
			}

			// 평균 실행 시간 반환
			return count > 0 ? totalDuration / count : null;

		} catch (IOException e) {
			throw new RuntimeException("Elasticsearch에서 pipeline 실행 시간 평균 계산 중 오류 발생", e);
		}
	}

	@Override
	public List<LogPipelineGetResponse> getPipelines(LogPipelineGetRequest request) {
		try {
			String timeStart = request.getTimeStart()
				.atZone(ZoneId.of("Asia/Seoul"))
				.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);

			String timeEnd = request.getTimeEnd()
				.atZone(ZoneId.of("Asia/Seoul"))
				.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);

			SearchRequest searchRequest = SearchRequest.of(s -> s
				.index("express-logs-*")
				.query(q -> q
					.bool(b -> b
						.filter(
							TermQuery.of(t -> t.field("type.keyword").value("pipelineStatus"))._toQuery(),
							RangeQuery.of(r -> r
								.date(d -> d
									.field("timestamp")
									.gte(timeStart)
									.lte(timeEnd))
							)._toQuery()
						)
					)
				)
				.size(10000)
			);

			SearchResponse<Map> response = elasticsearchClient.search(searchRequest, Map.class);

			List<LogPipelineGetResponse> result = new ArrayList<>();

			Map<String, String> inProgressTimestamps = new HashMap<>();
			Map<String, String> finishedTimestamps = new HashMap<>();
			Map<String, Map<String, Object>> pipelineDetails = new HashMap<>(); // ✅ pipelineId 별 details

			for (Hit<Map> hit : response.hits().hits()) {
				Map<String, Object> source = hit.source();
				if (source == null)
					continue;

				String pipelineId = (String)source.get("pipelineId");
				String status = (String)source.get("status");
				String timestampStr = (String)source.get("timestamp");

				if (pipelineId == null || status == null || timestampStr == null)
					continue;

				if ("INPROGRESS".equals(status)) {
					inProgressTimestamps.put(pipelineId, timestampStr);
				} else if ("FINISHED".equals(status)) {
					finishedTimestamps.put(pipelineId, timestampStr);
					Map<String, Object> details = (Map<String, Object>)source.get("details");
					if (details != null) {
						pipelineDetails.put(pipelineId, details);
					}
				}
			}

			for (String pipelineId : inProgressTimestamps.keySet()) {
				if (finishedTimestamps.containsKey(pipelineId)) {
					Map<String, Object> details = pipelineDetails.getOrDefault(pipelineId, Collections.emptyMap());

					LogPipelineGetResponse responseDto = LogPipelineGetResponse.builder()
						.pipelineId(pipelineId)
						.inProgressTimestamp(
							OffsetDateTime.parse(inProgressTimestamps.get(pipelineId)).toLocalDateTime())
						.finishedTimestamp(OffsetDateTime.parse(finishedTimestamps.get(pipelineId)).toLocalDateTime())
						.savedPwaCount(asLong(details.get("savedPwaCount")))
						.totalProcessed(asLong(details.get("totalProcessed")))
						.pwaCount(asLong(details.get("pwaCount")))
						.errorCount(asLong(details.get("errorCount")))
						.executionTime(asLong(details.get("executionTime")))
						.noPwaCount(asLong(details.get("noPwaCount")))
						.build();

					if (responseDto.getExecutionTime() < 600 || responseDto.getTotalProcessed() == 0) {
						continue;
					}
					result.add(responseDto);
				}
			}

			// finishedTimestamp 기준 내림차순 정렬
			result.sort(Comparator.comparing(LogPipelineGetResponse::getFinishedTimestamp).reversed());

			return result;

		} catch (IOException e) {
			throw new RuntimeException("Elasticsearch에서 파이프라인 FINISHED 로그 조회 중 오류 발생", e);
		}
	}

	private Long asLong(Object obj) {
		if (obj instanceof Number) {
			return ((Number)obj).longValue();
		} else if (obj instanceof String) {
			try {
				double doubleValue = Double.parseDouble((String)obj);
				return (long)doubleValue;
			} catch (NumberFormatException e) {
				return 0L;
			}
		}
		return 0L;
	}

	@Override
	public Long countSiteStepSuccess(String pipelineId) {
		try {
			// Elasticsearch 검색 요청 생성
			SearchRequest searchRequest = SearchRequest.of(s -> s
				.index("express-logs-*")
				.query(q -> q.bool(b -> b.must(
					TermQuery.of(t -> t.field("pipelineId.keyword").value(pipelineId))._toQuery(),
					TermQuery.of(t -> t.field("type.keyword").value("siteStep"))._toQuery(),
					TermQuery.of(t -> t.field("status.keyword").value("SUCCESS"))._toQuery()
				)))
				.aggregations("site_step_success_count", a -> a
					.valueCount(v -> v.field("pipelineId.keyword")) // 특정 조건을 만족하는 문서 개수 계산
				)
			);

			// Elasticsearch 검색 요청 실행
			SearchResponse<Void> response = elasticsearchClient.search(searchRequest, Void.class);

			// Aggregation 결과 가져오기
			return (long)response.aggregations()
				.get("site_step_success_count") // Aggregation 이름
				.valueCount()
				.value(); // 카운트 값 반환

		} catch (IOException e) {
			throw new RuntimeException(
				"Elasticsearch에서 pipelineId=" + pipelineId + "의 siteStep SUCCESS 로그 개수 조회 중 오류 발생", e);
		}
	}

	@Override
	public Long countSiteProcessPwa(String pipelineId) {
		try {
			// Elasticsearch 검색 요청 생성
			SearchRequest searchRequest = SearchRequest.of(s -> s
				.index("express-logs-*")
				.query(q -> q.bool(b -> b.must(
					TermQuery.of(t -> t.field("pipelineId.keyword").value(pipelineId))._toQuery(),
					TermQuery.of(t -> t.field("type.keyword").value("siteProcess"))._toQuery(),
					TermQuery.of(t -> t.field("status.keyword").value("PWA"))._toQuery()
				)))
				.aggregations("site_process_pwa_count", a -> a
					.valueCount(v -> v.field("pipelineId.keyword")) // 특정 조건을 만족하는 문서 개수 계산
				)
			);

			// Elasticsearch 검색 요청 실행
			SearchResponse<Void> response = elasticsearchClient.search(searchRequest, Void.class);

			// Aggregation 결과 가져오기
			return (long)response.aggregations()
				.get("site_process_pwa_count") // Aggregation 이름
				.valueCount()
				.value(); // 카운트 값 반환

		} catch (IOException e) {
			throw new RuntimeException(
				"Elasticsearch에서 pipelineId=" + pipelineId + "의 siteProcess PWA 로그 개수 조회 중 오류 발생", e);
		}
	}

	@Override
	public Long countErrorLogs(String pipelineId) {
		try {
			// Elasticsearch 검색 요청 생성
			SearchRequest searchRequest = SearchRequest.of(s -> s
				.index("express-logs-*")
				.query(q -> q.bool(b -> b.must(
					TermQuery.of(t -> t.field("pipelineId.keyword").value(pipelineId))._toQuery(),
					TermQuery.of(t -> t.field("logLevel.keyword").value("ERROR"))._toQuery()
				)))
				.aggregations("error_logs_count", a -> a
					.valueCount(v -> v.field("pipelineId.keyword")) // 특정 조건을 만족하는 문서 개수 계산
				)
			);

			// Elasticsearch 검색 요청 실행
			SearchResponse<Void> response = elasticsearchClient.search(searchRequest, Void.class);

			// Aggregation 결과 가져오기
			return (long)response.aggregations()
				.get("error_logs_count") // Aggregation 이름
				.valueCount()
				.value(); // 카운트 값 반환

		} catch (IOException e) {
			throw new RuntimeException(
				"Elasticsearch에서 pipelineId=" + pipelineId + "의 ERROR 로그 개수 조회 중 오류 발생", e);
		}
	}
}
