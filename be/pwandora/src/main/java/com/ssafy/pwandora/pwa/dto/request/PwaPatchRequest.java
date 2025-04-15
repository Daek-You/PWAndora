package com.ssafy.pwandora.pwa.dto.request;

import com.ssafy.pwandora.pwa.entity.AcceptanceStatus;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "관리자용 PWA 정보 수정")
public class PwaPatchRequest {

	@Schema(description = "아이콘 이미지 url", example = "https://example.com")
	private String iconImage;

	@Schema(description = "웹사이트 URL", example = "https://example.com")
	private String websiteUrl;

	@Schema(description = "현재 버전", example = "1.0.3")
	private String version;

	@Schema(description = "개발 회사", example = "ABC Corp")
	private String company;

	@Schema(description = "개발자 웹사이트", example = "https://developer.example.com")
	private String developerSite;

	@Schema(description = "승인 상태", example = "ACCEPTED")
	private AcceptanceStatus acceptanceStatus;

}
