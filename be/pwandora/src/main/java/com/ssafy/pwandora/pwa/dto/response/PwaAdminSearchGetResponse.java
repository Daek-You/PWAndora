package com.ssafy.pwandora.pwa.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.pwandora.pwa.entity.AcceptanceStatus;
import com.ssafy.pwandora.pwa.entity.file.FileType;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
@Schema(description = "PWA 관리자 검색 응답")
public class PwaAdminSearchGetResponse {

	@Schema(description = "PWA ID", example = "1")
	private Integer id;

	@Schema(description = "아이콘 이미지 URL", example = "https://example.com/icon.png")
	private String iconImage;

	@Schema(description = "PWA 이름", example = "My Awesome PWA")
	private String name;

	@Schema(description = "웹사이트 URL", example = "https://example.com")
	private String websiteUrl;

	@Schema(description = "총 다운로드 수", example = "12345")
	private Integer downloadCount;

	@Schema(description = "차단 일자(차단 안됬을시 null)", example = "2024-03-01T12:00:00")
	private LocalDateTime blockedAt;

	@Schema(description = "생성 일자", example = "2024-03-01T12:00:00")
	private LocalDateTime createdAt;

	@Schema(description = "마지막 수정 일자", example = "2024-03-10T15:30:00")
	private LocalDateTime updatedAt;

	@Schema(description = "승인 상태", example = "ACCEPTED")
	private AcceptanceStatus acceptanceStatus;

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
