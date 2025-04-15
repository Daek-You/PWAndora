package com.ssafy.pwandora.pwa.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class PwaCategoryCountGetResponse {

	@Schema(description = "카테고리 ID", example = "1")
	private Integer id;

	@Schema(description = "카테고리 이름", example = "Game")
	private String name;

	@Schema(description = "해당 카테고리에 속한 PWA 개수", example = "150")
	private Long count;
}
