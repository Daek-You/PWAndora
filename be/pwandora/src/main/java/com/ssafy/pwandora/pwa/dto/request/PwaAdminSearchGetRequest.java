package com.ssafy.pwandora.pwa.dto.request;

import com.ssafy.pwandora.pwa.entity.AcceptanceStatus;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = false)
@Data
@Schema(description = "관리자용 PWA 검색 요청")
public class PwaAdminSearchGetRequest extends PwaSearchGetRequest {

	@Schema(description = "차단 여부", example = "false")
	private Boolean isBlocked;

	@Schema(description = "승인 상태(전체 조회를 원할시 null)", example = "ACCEPTED")
	private AcceptanceStatus acceptanceStatus;
}
