package com.ssafy.pwandora.pwa.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "관리자용 PWA Content 정보 수정")
public class PwaContentPatchRequest {

	@Schema(description = "PWA 이름", example = "MyApp")
	private String name;

	@Schema(description = "PWA 요약 정보", example = "이 앱은 최고의 유틸리티 앱입니다.")
	private String summary;

	@Schema(description = "PWA 상세 설명", example = "이 앱은 다양한 기능을 제공하며, 사용자가 편리하게 사용할 수 있도록 설계되었습니다.")
	private String description;

}
