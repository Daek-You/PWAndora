package com.ssafy.pwandora.language.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
@Schema(description = "언어 목록 전체 조회")
public class LanguageGetResponse {

	@Schema(description = "Language ID", example = "1")
	private Integer id;

	@Schema(description = "언어 이름", example = "English")
	private String name;

	@Schema(description = "언어 코드", example = "en")
	private String code;
}
