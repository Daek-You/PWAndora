package com.ssafy.pwandora.pwa.dto.request;

import com.ssafy.pwandora.pwa.entity.AcceptanceStatus;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "관리자용 승인 수정")
public class PwaAcceptancePostRequest {
	private AcceptanceStatus acceptanceStatus;
}
