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
@Schema(description = "PWA 관리자용 상세 조회 응답")
public class PwaAdminDetailGetResponse {

	@Schema(description = "PWA ID", example = "1")
	private Integer id;

	@Schema(description = "아이콘 이미지 url", example = "https://example.com")
	private String iconImage;

	@Schema(description = "웹사이트 URL", example = "https://example.com")
	private String websiteUrl;

	@Schema(description = "평균 평점", example = "4.5")
	private Float avgScore;

	@Schema(description = "다운로드 횟수", example = "10000")
	private Integer downloadCount;

	@Schema(description = "현재 버전", example = "1.0.3")
	private String version;

	@Schema(description = "개발 회사", example = "ABC Corp")
	private String company;

	@Schema(description = "개발자 웹사이트", example = "https://developer.example.com")
	private String developerSite;

	@Schema(description = "연령 제한", example = "12+")
	private String ageLimit;

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

	@Schema(description = "디스플레이 정보")
	private DisplayDto display;

	@Schema(description = "스크린샷 목록")
	private List<ScreenshotDto> screenshots;

	@Schema(description = "카테고리 목록")
	private List<CategoryDto> categories;

	@Schema(description = "해시태그 목록")
	private List<HashtagDto> hashtags;

	@Schema(description = "지원 언어 목록")
	private List<LanguageDto> languages;

	@Schema(description = "권한 목록")
	private List<PermissionDto> permissions;

	@Schema(description = "파일 목록")
	private List<FileDto> files;

	@Schema(description = "내용 목록")
	private List<ContentDto> contents;

	@Data
	@Builder
	@AllArgsConstructor
	@Schema(description = "언어별 content")
	public static class ContentDto {
		@Schema(description = "PWA 이름", example = "MyApp")
		private String name;

		@Schema(description = "PWA 요약 정보", example = "이 앱은 최고의 유틸리티 앱입니다.")
		private String summary;

		@Schema(description = "PWA 상세 설명", example = "이 앱은 다양한 기능을 제공하며, 사용자가 편리하게 사용할 수 있도록 설계되었습니다.")
		private String description;

		@Schema(description = "언어 id", example = "1")
		private Integer languageId;

		@Schema(description = "언어 이름", example = "English")
		private String languageName;

		@Schema(description = "언어 코드", example = "en")
		private String languageCode;
	}

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

	// Display DTO
	@Data
	@Builder
	@AllArgsConstructor
	@Schema(description = "디스플레이 정보")
	public static class DisplayDto {
		@Schema(description = "32인치 지원여부", example = "true")
		private Boolean isLarge;

		@Schema(description = "9인치 지원여부", example = "true")
		private Boolean isMedium;

		@Schema(description = "7인치 지원여부", example = "true")
		private Boolean isMediumSmall;

		@Schema(description = "4.3인치 지원여부", example = "true")
		private Boolean isSmall;

		@Schema(description = "32인치 이미지 url", example = "https://example.com/image.png")
		private String imageUrlLarge;

		@Schema(description = "9/7인치 이미지 url", example = "https://example.com/image.png")
		private String imageUrlMedium;

		@Schema(description = "4.3인치 이미지 url", example = "https://example.com/image.png")
		private String imageUrlSmall;
	}

	// Screenshot DTO
	@Data
	@Builder
	@AllArgsConstructor
	@Schema(description = "스크린샷 정보")
	public static class ScreenshotDto {
		@Schema(description = "스크린샷 이미지 URL", example = "https://example.com/image.png")
		private String imageUrl;

		@Schema(description = "스크린샷 순서", example = "1")
		private Integer screenshotOrder;
	}

	// Category DTO
	@Data
	@Builder
	@AllArgsConstructor
	@Schema(description = "카테고리 정보")
	public static class CategoryDto {
		@Schema(description = "카테고리 이름", example = "게임")
		private String name;

		@Schema(description = "카테고리 순서", example = "1")
		private Integer categoryOrder;
	}

	// Hashtag DTO
	@Data
	@Builder
	@AllArgsConstructor
	@Schema(description = "해시태그 정보")
	public static class HashtagDto {
		@Schema(description = "해시태그 이름", example = "#유틸리티")
		private String name;
	}

	// Language DTO
	@Data
	@Builder
	@AllArgsConstructor
	@Schema(description = "지원 언어 정보")
	public static class LanguageDto {
		@Schema(description = "언어 이름", example = "한국어")
		private String name;

		@Schema(description = "언어 코드", example = "ko")
		private String code;
	}

	// Permission DTO
	@Data
	@Builder
	@AllArgsConstructor
	@Schema(description = "앱 권한 정보")
	public static class PermissionDto {
		@Schema(description = "권한 이름", example = "위치 접근")
		private String name;

		@Schema(description = "필수 여부", example = "true")
		private Boolean isRequired;
	}
}
