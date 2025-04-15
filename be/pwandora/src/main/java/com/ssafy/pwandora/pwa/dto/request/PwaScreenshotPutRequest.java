package com.ssafy.pwandora.pwa.dto.request;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "관리자용 PWA Screenshot 정보 수정")
public class PwaScreenshotPutRequest {
	private List<Integer> screenshotOrders;
}
