package com.ssafy.pwandora.event.dto.response;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
@Schema(description = "생성일 순 상위 5개 이벤트 조회 응답")
public class EventGetResponse {

	@Schema(description = "제목", example = "신규 가입 할인")
	private String title;

	@Schema(description = "이벤트 설명", example = "이번밖에 없는 인생에 단 한번뿐인 기회!")
	private String description;

	@Schema(description = "색깔")
	private String color;

	@Schema(description = "시작일 : 없을수도있음", example = "2024-03-01T12:00:00")
	private LocalDateTime startAt;

	@Schema(description = "종료일 : 없을수도있음", example = "2024-03-01T12:00:00")
	private LocalDateTime endAt;

	@Schema(description = "해당 이벤트에 해당하는 PWA id", example = "http://example.com")
	private Integer pwaId;

	@Schema(description = "앱 이름", example = "마켓 컬리")
	private String name;

	@Schema(description = "앱 아이콘 url", example = "1")
	private String iconUrl;
}
