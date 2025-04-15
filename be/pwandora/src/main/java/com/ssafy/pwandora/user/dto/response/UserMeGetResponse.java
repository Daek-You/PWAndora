package com.ssafy.pwandora.user.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
@Schema(description = "유저 정보 응답")
public class UserMeGetResponse {

	@Schema(description = "언어 id", example = "1")
	private Integer languageId;

	@Schema(description = "언어 이름", example = "English")
	private String languageName;

	@Schema(description = "언어 코드", example = "en")
	private String languageCode;
}
