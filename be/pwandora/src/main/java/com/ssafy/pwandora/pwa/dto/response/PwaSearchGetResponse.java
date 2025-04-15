package com.ssafy.pwandora.pwa.dto.response;

import java.util.List;

import com.ssafy.pwandora.pwa.entity.file.FileType;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
@Schema(description = "PWA 검색 응답")
public class PwaSearchGetResponse {

	@Schema(description = "PWA ID", example = "1")
	private Integer id;

	@Schema(description = "아이콘 이미지 url", example = "https://example.com")
	private String iconImage;

	@Schema(description = "PWA 이름", example = "MyApp")
	private String name;

	@Schema(description = "PWA 요약 정보", example = "이 앱은 최고의 유틸리티 앱입니다.")
	private String summary;

	@Schema(description = "PWA 상세 설명", example = "이 앱은 다양한 기능을 제공하며, 사용자가 편리하게 사용할 수 있도록 설계되었습니다.")
	private String description;

	@Schema(description = "다운로드 횟수", example = "20M+")
	private Integer downloadCount;

	@Schema(description = "앱 고유 id", example = "pwa012b67b")
	private String appId;

	@Schema(description = "카테고리 목록")
	private List<CategoryDto> categories;

	@Schema(description = "파일 목록")
	private List<FileDto> files;

	@Data
	@Builder
	@AllArgsConstructor
	@Schema(description = "앱 파일 정보")
	public static class FileDto {

		@Schema(description = "다운로드 URL", example = "https://example.com/download.wgt")
		private String downloadUrl;

		@Schema(description = "파일 크기 (MB)", example = "15MB")
		private String fileSize;

		@Schema(description = "파일 타입", example = "WGT")
		private FileType fileType;
	}

	// Category DTO
	@Data
	@Builder
	@AllArgsConstructor
	@Schema(description = "카테고리 정보")
	public static class CategoryDto {
		@Schema(description = "카테고리 이름", example = "Game")
		private String name;

		@Schema(description = "카테고리 순서", example = "1")
		private Integer categoryOrder;
	}
}