package com.ssafy.pwandora.log.entity;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.Data;

@Data
@Document(indexName = "express-logs-*") // 날짜 포함 인덱스 매칭 가능
public class Log {

	@Id
	private String id;

	@Field(type = FieldType.Keyword, name = "logLevel")
	private String logLevel;

	@Field(type = FieldType.Text, name = "type")
	private String type;

	@Field(type = FieldType.Text, name = "status")
	private String status;

	@Field(type = FieldType.Text, name = "step")
	private String step;

	@Field(type = FieldType.Text, name = "message")
	private String message;

	@Field(type = FieldType.Date, name = "timestamp")
	private String timestamp;

	@Field(type = FieldType.Object, name = "site")
	private Site site;

	@Field(type = FieldType.Keyword, name = "pipelineId")
	private String pipelineId;

	@Field(type = FieldType.Object)
	private Map<String, Object> details;

	@Data
	public static class Site {
		@Field(type = FieldType.Long, name = "id")
		private Long id;

		@Field(type = FieldType.Keyword, name = "url")
		private String url;
	}

	public LocalDateTime getTimestamp() {
		return timestamp != null ? ZonedDateTime.parse(timestamp).toLocalDateTime() : null;
	}
}
