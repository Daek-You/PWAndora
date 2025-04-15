package com.ssafy.pwandora.acceptance.dto.request;

import com.ssafy.pwandora.acceptance.dto.CategoryDto;
import com.ssafy.pwandora.pwa.dto.request.PwaScreenshotPutRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AcceptanceRegisterPostRequest {
    private String crawledDataStatus;
    private DisplayCompatibilityDto displayCompatibilityDto;
    private ScreenShotDto screenShotDto;
    private AISuggestionDto aiSuggestionDto;
    private String aiCensorStatus;
    private String packagingStatus;
    private String lightHouseStatus;
    private String securityStatus;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScreenShotDto {
        private String status;
        private PwaScreenshotPutRequest request;
        private List<MultipartFile> images;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DisplayCompatibilityDto {
        private String status;
        // 추후에 디스플레이 화면마다의 Confirm 버튼 도입을 하게 되면, DTO 양식 바꿔야 함
        private Boolean isLargeSizeCompatible;          // 1080x1920
        private Boolean isMediumSizeCompatible;         // 1024x600
        private Boolean isMediumSmallSizeCompatible;    // 1024x600
        private Boolean isSmallSizeCompatible;          // 800x480
    }


    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AISuggestionDto {
        private String status;
        private Map<String, AISuggestionData> aiSuggestionDataMap;
        private List<Integer> categoryIds;
        private String ageRating;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AISuggestionData {
        private String summary;
        private String description;
    }
}