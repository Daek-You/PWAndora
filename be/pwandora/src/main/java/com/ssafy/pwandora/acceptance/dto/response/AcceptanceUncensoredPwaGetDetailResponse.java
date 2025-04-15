package com.ssafy.pwandora.acceptance.dto.response;


import com.ssafy.pwandora.acceptance.dto.CategoryDto;
import lombok.*;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AcceptanceUncensoredPwaGetDetailResponse {
    private CrawledDataStepDto crawledDataStepDto;                      // 1. Crawled Data 검수 단계
    private DisplayCompatibilityStepDto displayCompatibilityStepDto;    // 2. 디스플레이 적합도 검수 단계
    private ScreenshotCensorStepDto screenshotCensorStepDto;            // 3. 스크린샷 검수 단계
    private AISuggestionStepDto aiSuggestionStepDto;                    // 4. AI Suggestions 검수 단계
    private AICensorStepDto aiCensorStepDto;                            // 5. AI Censor 검수 단계
    private PackagingStepDto packagingStepDto;                          // 6. Packaging 검수 단계
                                                                        // 7. Lighthouse 검수 단계는 별도의 API로 받아올 예정
    private SecurityStepDto securityStepDto;                            // 8. Security 검수 단계


    // ------------------------------------------------------------------------------------------------------------
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CrawledDataStepDto {
        private String status;
        private String name;
        private String iconImageUrl;
        private String startUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DisplayCompatibilityStepDto {
        private String status;
        private List<DisplayInfoDto> displayInfoDtos;
    }

    @Data
    @AllArgsConstructor
    public static class DisplayInfoDto {
        private String deviceName;      // ex. "Bespoke AI Home"
        private String size;            // ex. "32inch (1080x1920)"
        private String screenshotUrl;   // 해당 해상도 크기의 스크린샷 URL
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScreenshotCensorStepDto {
        private String status;
        private List<String> screenshotUrls;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AISuggestionStepDto {
        private String status;
        Map<String, AISuggestionDto> aiSuggestionDtoMap;      // "ko", "en"에 따라 분류해서
    }

    @Data
    @AllArgsConstructor
    public static class AISuggestionDto {
        private String summary;
        private String description;
        private List<CategoryDto> categories;
        private String ageRating;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AICensorStepDto {
        private String status;
        private Integer childEndangermentPercent;
        private Integer inappropriateContentPercent;
        private Integer financialServicePercent;
        private Integer realMoneyGamblingPercent;
        private Integer illegalActivityPercent;
        private Integer healthContentServicePercent;
        private Integer blockchainBasedContentPercent;
        private Integer aiGeneratedContentPercent;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PackagingStepDto {
        private String status;
        List<PackagingData> packagingData;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PackagingData {
        private String downloadUrl;
        private String fileSize;
        private String fileType;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LighthouseResultDto {       // 별도로 API 뺄 예정
        private String status;
        private Integer performanceScore;
        private Integer accessibilityScore;
        private Integer bestPracticeScore;
        private Integer seoScore;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SecurityStepDto {
        private String status;
        private Boolean isHttpsActive;
        private Boolean isCspActive;
    }
}
