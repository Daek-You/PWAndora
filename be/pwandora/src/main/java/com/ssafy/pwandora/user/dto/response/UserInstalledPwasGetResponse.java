package com.ssafy.pwandora.user.dto.response;

import java.util.List;

import com.ssafy.pwandora.pwa.entity.file.FileType;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInstalledPwasGetResponse {
	private Integer id;              // PWA 앱의 ID
	private String name;                // 앱 이름
	private String iconImage;             // 아이콘 이미지 URL
	private String downloadCount;       // 다운로드 수 + "M+" 형식
	private Boolean isInstalled;        // 설치 상태
	private String appId;

	@Schema(description = "다운로드 URL - 삭제용", example = "https://example.com/download.wgt")
	private String downloadUrl;

	@Schema(description = "카테고리 목록")
	private List<CategoryDto> categories;

	@Schema(description = "파일 목록")
	private List<FileDto> files;

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
}
