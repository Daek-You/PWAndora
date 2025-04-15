package com.ssafy.pwandora.pwa.dto.request;

import com.ssafy.pwandora.global.dto.CommonPageRequest;
import com.ssafy.pwandora.pwa.entity.file.FileType;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = false)
@Data
@Schema(description = "PWA 검색 요청")
public class PwaSearchGetRequest extends CommonPageRequest {

	@Schema(description = "PWA 이름", example = "My PWA App")
	private String name;

	@Schema(description = "카테고리", example = "Game")
	private String category;

	@Schema(description = "해시태그", example = "인기")
	private String hashtag;

	@Schema(description = "지원 언어", example = "korean")
	private String language;

	@Schema(description = "파일 형식", example = "WGT")
	private FileType fileType;
}