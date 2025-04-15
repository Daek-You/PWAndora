package com.ssafy.pwandora.pwa.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
@Schema(description = "PWA 카테고리 목록 조회")
public class PwaCategoryGetResponse {

	@Schema(description = "카테고리 ID", example = "1")
	private Integer id;

	@Schema(description = "카테고리 이름", example = "Game")
	private String name;

	@Schema(description = "카테고리 순서", example = "1")
	private Integer categoryOrder;

	@Schema(description = "카테고리 이미지 URL", example = "https://example.com")
	private String categoryImage;
}
