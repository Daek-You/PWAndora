package com.ssafy.pwandora.acceptance.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.pwandora.acceptance.dto.CategoryDto;
import com.ssafy.pwandora.acceptance.dto.request.AcceptanceRegisterPostRequest;
import com.ssafy.pwandora.acceptance.dto.response.AcceptanceUncensoredPwaGetDetailResponse;
import com.ssafy.pwandora.acceptance.dto.response.AcceptanceUncensoredPwaGetResponse;
import com.ssafy.pwandora.acceptance.entity.AcceptanceChecklist;
import com.ssafy.pwandora.acceptance.entity.ContentModeration;
import com.ssafy.pwandora.acceptance.entity.Security;
import com.ssafy.pwandora.acceptance.repository.AcceptanceRepository;
import com.ssafy.pwandora.acceptance.repository.ContentModerationRepository;
import com.ssafy.pwandora.acceptance.repository.SecurityRepository;
import com.ssafy.pwandora.acceptance.util.TempDirectoryContext;
import com.ssafy.pwandora.global.dto.CommonPageResponse;
import com.ssafy.pwandora.language.entity.Language;
import com.ssafy.pwandora.language.repository.LanguageRepository;
import com.ssafy.pwandora.pwa.entity.AcceptanceStatus;
import com.ssafy.pwandora.pwa.entity.AgeLimit;
import com.ssafy.pwandora.pwa.entity.Content;
import com.ssafy.pwandora.pwa.entity.Pwa;
import com.ssafy.pwandora.pwa.entity.category.Category;
import com.ssafy.pwandora.pwa.entity.category.PwaCategory;
import com.ssafy.pwandora.pwa.entity.display.Display;
import com.ssafy.pwandora.pwa.entity.file.PwaFile;
import com.ssafy.pwandora.pwa.entity.screenshot.Screenshot;
import com.ssafy.pwandora.pwa.repository.PwaRepository;
import com.ssafy.pwandora.pwa.repository.content.ContentRepository;
import com.ssafy.pwandora.pwa.repository.display.DisplayRepository;
import com.ssafy.pwandora.pwa.repository.file.PwaFileRepository;
import com.ssafy.pwandora.pwa.repository.pwacategory.CategoryRepository;
import com.ssafy.pwandora.pwa.repository.pwacategory.PwaCategoryRepository;
import com.ssafy.pwandora.pwa.repository.screenshot.ScreenshotRepository;
import com.ssafy.pwandora.pwa.service.PwaService;
import com.ssafy.pwandora.user.entity.User;
import com.ssafy.pwandora.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class AcceptanceService {

    private final PwaRepository pwaRepository;
    private final AcceptanceRepository acceptanceRepository;
    private final DisplayRepository displayRepository;
    private final ScreenshotRepository screenshotRepository;
    private final ContentModerationRepository contentModerationRepository;
    private final PwaFileRepository pwaFileRepository;
    private final SecurityRepository securityRepository;
    private final ContentRepository contentRepository;
    private final CategoryRepository categoryRepository;
    private final ObjectMapper objectMapper;
    private final PwaService pwaService;
    private final LanguageRepository languageRepository;
    private final PwaCategoryRepository pwaCategoryRepository;
    private final UserRepository userRepository;

    private final int LIGHTHOUSE_TIMEOUT = 60;

    @Transactional
    public void updatePwaAcceptance(Integer pwaId, AcceptanceRegisterPostRequest request) {
        Pwa pwa = pwaRepository.findById(pwaId).orElseThrow(() -> new RuntimeException("해당 PWA를 찾을 수 없습니다."));
        AcceptanceChecklist checklist = updateChecklist(pwaId, request);
        updateDisplayCompatibility(pwaId, request.getDisplayCompatibilityDto());
        updateScreenshots(pwaId, request.getScreenShotDto());
        updateAiSuggestion(pwa, request.getAiSuggestionDto());
        finalizeAcceptance(pwa, checklist);
    }

    private AcceptanceChecklist updateChecklist(Integer pwaId, AcceptanceRegisterPostRequest request) {
        // 기존 체크리스트 조회 또는 새로 생성
        AcceptanceChecklist checklist = acceptanceRepository.findById(pwaId).orElseThrow(() -> new RuntimeException("존재하지 않는 PWA입니다. ID: " + pwaId));

        // 각 항목 상태 업데이트
        checklist.setCrawledStatus(request.getCrawledDataStatus());
        checklist.setDisplayStatus(request.getDisplayCompatibilityDto().getStatus());
        checklist.setScreenshotStatus(request.getScreenShotDto().getStatus());
        checklist.setAiSuggestionStatus(request.getAiSuggestionDto().getStatus());
        checklist.setAiCensorStatus(request.getAiCensorStatus());
        checklist.setPackagingStatus(request.getPackagingStatus());
        checklist.setLighthouseStatus(request.getLightHouseStatus());
        checklist.setSecurityStatus(request.getSecurityStatus());
        acceptanceRepository.save(checklist);
        return checklist;
    }

    private void updateDisplayCompatibility(Integer pwaId, AcceptanceRegisterPostRequest.DisplayCompatibilityDto dto) {
        if (dto == null)    return;

        // 기존 디스플레이 정보 조회 또는 새로 생성
        Display display = displayRepository.findByPwaId(pwaId).orElseThrow(() -> new RuntimeException("해당 앱에 대한 디스플레이 정보가 없습니다."));

        // 각 화면 크기별 호환성 설정
        display.setIsLarge(dto.getIsLargeSizeCompatible());
        display.setIsMedium(dto.getIsMediumSizeCompatible());
        display.setIsMediumSmall(dto.getIsMediumSmallSizeCompatible());
        display.setIsSmall(dto.getIsSmallSizeCompatible());
        displayRepository.save(display);
    }

    private void updateScreenshots(Integer pwaId, AcceptanceRegisterPostRequest.ScreenShotDto dto) {
        if (dto == null)    return;
        pwaService.updatePwaScreenshot(pwaId, dto.getRequest(), dto.getImages());
    }

    private void updateAiSuggestion(Pwa pwa, AcceptanceRegisterPostRequest.AISuggestionDto dto) {
        if (dto == null) return;

        updateAgeRating(pwa, dto.getAgeRating());                                       // 1. 연령 등급 업데이트
        updateMultiLanguageContents(pwa.getId(), dto.getAiSuggestionDataMap());         // 2. 다국어 콘텐츠 업데이트 (요약, 설명)
        updatePwaCategories(pwa.getId(), dto.getCategoryIds());                         // 3. 카테고리 업데이트
    }

    private void updateAgeRating(Pwa pwa, String ageRatingName) {
        if (ageRatingName == null) return;

        // 이름으로 Enum 값 찾기
        AgeLimit ageLimit = Arrays.stream(AgeLimit.values()).filter(age -> age.getName().equals(ageRatingName)).findFirst().orElse(AgeLimit.UNRATED);
        pwa.setAgeLimit(ageLimit);
        pwaRepository.save(pwa);
    }

    private void updateMultiLanguageContents(Integer pwaId, Map<String, AcceptanceRegisterPostRequest.AISuggestionData> contentMap) {
        if (contentMap == null || contentMap.isEmpty()) return;

        contentMap.forEach((languageCode, data) -> {
            Language language = languageRepository.findByCode(languageCode).orElseThrow(() -> new RuntimeException("지원하지 않는 언어입니다: " + languageCode));
            Content content = contentRepository.findByPwaIdAndLanguageId(pwaId, language.getId()).orElseThrow(() -> new RuntimeException("해당 언어의 콘텐츠가 없습니다: " + languageCode));

            content.setSummary(data.getSummary());
            content.setDescription(data.getDescription());
            contentRepository.save(content);
        });
    }

    private void updatePwaCategories(Integer pwaId, List<Integer> categoryIds) {
        if (categoryIds == null || categoryIds.isEmpty()) return;

        // 기존 카테고리 관계 조회
        List<PwaCategory> existingCategories = pwaCategoryRepository.findByPwaId(pwaId);
        Set<Integer> existingCategoryIds = existingCategories.stream().map(pc -> pc.getCategory().getId()).collect(Collectors.toSet());

        // 1. 삭제할 카테고리 제거
        existingCategories.stream().filter(pc -> !categoryIds.contains(pc.getCategory().getId())).forEach(pwaCategoryRepository::delete);

        // 2. 새로 추가할 카테고리만 처리
        categoryIds.stream().filter(id -> !existingCategoryIds.contains(id)).forEach(categoryId -> {
                    Pwa pwa = pwaRepository.getReferenceById(pwaId);
                    Category category = categoryRepository.getReferenceById(categoryId);
                    PwaCategory pwaCategory = PwaCategory.create(pwa, category);
                    pwaCategoryRepository.save(pwaCategory);
                });
    }

    private void finalizeAcceptance(Pwa pwa, AcceptanceChecklist checklist) {
        // 모든 항목이 DONE 상태인지 확인
        boolean allDone = Stream.of(
                checklist.getCrawledStatus(),
                checklist.getDisplayStatus(),
                checklist.getScreenshotStatus(),
                checklist.getAiSuggestionStatus(),
                checklist.getAiCensorStatus(),
                checklist.getPackagingStatus(),
                checklist.getLighthouseStatus(),
                checklist.getSecurityStatus()
        ).allMatch(status -> "DONE".equals(status));

        if (allDone) {
            pwa.setAcceptanceStatus(AcceptanceStatus.ACCEPTED);
            pwa.setAcceptedAt(LocalDateTime.now());
            pwaRepository.save(pwa);
            return;
        }

        throw new RuntimeException("검수 항목 중에 체크(DONE)하지 않은 항목이 있습니다.");
    }

    @Transactional(readOnly = true)
    public CommonPageResponse<AcceptanceUncensoredPwaGetResponse> getUncensoredPwas(Integer userId, Pageable pageable) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("찾고자 하는 사용자가 없습니다."));
        Language language = user.getLanguage();
        Page<AcceptanceUncensoredPwaGetResponse> responsePage = pwaRepository.findUncensoredPwas(language.getId(), AcceptanceStatus.NONE, pageable);
        return CommonPageResponse.from(responsePage);
    }

    @Transactional(readOnly = true)
    public AcceptanceUncensoredPwaGetDetailResponse getPwaAcceptanceDetail(Integer userId, Integer pwaId) {
        // PWA 존재 여부 확인
        Pwa pwa = pwaRepository.findById(pwaId).orElseThrow(() -> new RuntimeException("존재하지 않는 PWA입니다. ID: " + pwaId));
        // User 존재 여부 확인
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("찾는 유저가 없습니다."));
        Language langauge = user.getLanguage();

        // 해당 PWA 앱의 영어로 된 콘텐츠 찾기
        Content englishContent = contentRepository.findByPwaIdAndLanguageCode(pwa.getId(), langauge.getCode()).orElse(null);

        // 검수 체크리스트 상태 조회
        AcceptanceChecklist checklist = acceptanceRepository.findByPwaId(pwaId).orElseThrow(() -> new RuntimeException("검수 정보가 없는 PWA입니다. ID: " + pwaId));

        // 1. Crawled Data Step
        AcceptanceUncensoredPwaGetDetailResponse.CrawledDataStepDto crawledDataStepDto = getCrawledDataStepDto(pwa, englishContent.getName(), checklist.getCrawledStatus());

        // 2. Display Compatibility Step
        AcceptanceUncensoredPwaGetDetailResponse.DisplayCompatibilityStepDto displayCompatibilityStepDto = getDisplayCompatibilityStepDto(pwaId, checklist.getDisplayStatus());

        // 3. Screenshot Censor Step
        AcceptanceUncensoredPwaGetDetailResponse.ScreenshotCensorStepDto screenshotCensorStepDto = getScreenshotCensorStepDto(pwaId, checklist.getScreenshotStatus());

        // 4. AI Suggestion Step
        AcceptanceUncensoredPwaGetDetailResponse.AISuggestionStepDto aiSuggestionStepDto = getAISuggestionStepDto(pwaId, checklist.getAiSuggestionStatus());

        // 5. AI Censor Step
        AcceptanceUncensoredPwaGetDetailResponse.AICensorStepDto aiCensorStepDto = getAICensorStepDto(pwaId, checklist.getAiCensorStatus());

        // 6. Packaging Step
        AcceptanceUncensoredPwaGetDetailResponse.PackagingStepDto packagingStepDto = getPackagingStepDto(pwaId, checklist.getPackagingStatus());

        //  7. Lighthouse 단계는 별도의 API로 줄 예정이므로 생략

        // 8. Security Step
        AcceptanceUncensoredPwaGetDetailResponse.SecurityStepDto securityStepDto = getSecurityStepDto(pwaId, checklist.getSecurityStatus());

        // 최종 응답 구성
        return AcceptanceUncensoredPwaGetDetailResponse.builder()
                .crawledDataStepDto(crawledDataStepDto)
                .displayCompatibilityStepDto(displayCompatibilityStepDto)
                .screenshotCensorStepDto(screenshotCensorStepDto)
                .aiSuggestionStepDto(aiSuggestionStepDto)
                .aiCensorStepDto(aiCensorStepDto)
                .packagingStepDto(packagingStepDto)
                .securityStepDto(securityStepDto)
                .build();
    }

    // 1단계: Crawled Data 정보를 조회합니다.
    private AcceptanceUncensoredPwaGetDetailResponse.CrawledDataStepDto getCrawledDataStepDto(Pwa pwa, String englishAppName, String status) {
        return AcceptanceUncensoredPwaGetDetailResponse.CrawledDataStepDto.builder()
                .status(status).name(englishAppName).iconImageUrl(pwa.getIconImage())
                .startUrl(pwa.getWebsiteUrl()).build();
    }

    // 2단계: Display Compatibility 정보를 조회합니다.
    private AcceptanceUncensoredPwaGetDetailResponse.DisplayCompatibilityStepDto getDisplayCompatibilityStepDto(Integer pwaId, String status) {
        Display displayInfo = displayRepository.findByPwaId(pwaId).orElse(null);
        List<AcceptanceUncensoredPwaGetDetailResponse.DisplayInfoDto> displayInfoDtos = new ArrayList<>();

        // 32인치 디스플레이
        if (displayInfo != null && displayInfo.getIsLarge() != null) {
            displayInfoDtos.add(new AcceptanceUncensoredPwaGetDetailResponse.DisplayInfoDto(
                    "Bespoke Familyhub",
                    "32inch (1080x1920)",
                    displayInfo.getImageUrlLarge()));
        }

        // 9인치 디스플레이
        if (displayInfo != null && displayInfo.getIsMedium() != null) {
            displayInfoDtos.add(new AcceptanceUncensoredPwaGetDetailResponse.DisplayInfoDto(
                    "Bespoke AI Home",
                    "9inch (1024x600)",
                    displayInfo.getImageUrlMedium()));
        }

        // 7인치 디스플레이
        if (displayInfo != null && displayInfo.getIsMediumSmall() != null) {
            displayInfoDtos.add(new AcceptanceUncensoredPwaGetDetailResponse.DisplayInfoDto(
                    "Bespoke AI Home",
                    "7inch (1024x600)",
                    displayInfo.getImageUrlMedium()));
        }

        // 4.3인치 디스플레이
        if (displayInfo != null && displayInfo.getIsSmall() != null) {
            displayInfoDtos.add(new AcceptanceUncensoredPwaGetDetailResponse.DisplayInfoDto(
                    "Bespoke AI Home",
                    "4.3inch (800x480)",
                    displayInfo.getImageUrlSmall()));
        }

        return AcceptanceUncensoredPwaGetDetailResponse.DisplayCompatibilityStepDto.builder()
                .status(status).displayInfoDtos(displayInfoDtos).build();
    }

    // 3단계: Screenshot 정보를 조회합니다.
    private AcceptanceUncensoredPwaGetDetailResponse.ScreenshotCensorStepDto getScreenshotCensorStepDto(Integer pwaId, String status) {
        List<String> screenshotUrls = screenshotRepository.findByPwaIdOrderByScreenshotOrder(pwaId).stream()
                .map(Screenshot::getImageUrl).collect(Collectors.toList());

        return AcceptanceUncensoredPwaGetDetailResponse.ScreenshotCensorStepDto.builder()
                .status(status).screenshotUrls(screenshotUrls).build();
    }

    // 4단계: AI Suggestion 정보를 조회합니다.
    private AcceptanceUncensoredPwaGetDetailResponse.AISuggestionStepDto getAISuggestionStepDto(Integer pwaId, String status) {
        Pwa pwa = pwaRepository.findById(pwaId).orElseThrow(() -> new RuntimeException("존재하지 않는 PWA입니다. ID: " + pwaId));
        Map<String, AcceptanceUncensoredPwaGetDetailResponse.AISuggestionDto> aiSuggestionDtoMap = new HashMap<>();
        List<Content> contents = contentRepository.findByPwaId(pwaId);      // 다국어 컨텐츠 조회 (한국어, 영어)

        for (var content : contents) {
            String languageCode = content.getLanguage().getCode().toLowerCase();

            // ID와 이름을 모두 포함하는 카테고리 목록 조회
            List<CategoryDto> categories = categoryRepository.findCategoriesByPwaId(pwaId, content.getLanguage().getId())
                                                                                                      .stream().distinct().collect(Collectors.toList());
            // AI 제안 데이터 생성
            AcceptanceUncensoredPwaGetDetailResponse.AISuggestionDto aiSuggestionDto = new AcceptanceUncensoredPwaGetDetailResponse.AISuggestionDto(
                    content.getSummary(),
                    content.getDescription(),
                    categories,
                    pwa.getAgeLimit().getName()
            );

            aiSuggestionDtoMap.put(languageCode, aiSuggestionDto);
        }

        return new AcceptanceUncensoredPwaGetDetailResponse.AISuggestionStepDto(status, aiSuggestionDtoMap);
    }

    // 5단계: AI Censor 정보를 조회합니다.
    private AcceptanceUncensoredPwaGetDetailResponse.AICensorStepDto getAICensorStepDto(Integer pwaId, String status) {
        ContentModeration contentModeration = contentModerationRepository.findByPwaId(pwaId).orElse(null);

        if (contentModeration == null) {
            return AcceptanceUncensoredPwaGetDetailResponse.AICensorStepDto.builder().status(status).build();
        }

        return AcceptanceUncensoredPwaGetDetailResponse.AICensorStepDto.builder()
                .status(status)
                .childEndangermentPercent(contentModeration.getChildEndangerment())
                .inappropriateContentPercent(contentModeration.getInappropriateContent())
                .financialServicePercent(contentModeration.getFinancialService())
                .realMoneyGamblingPercent(contentModeration.getRealMoneyGambling())
                .illegalActivityPercent(contentModeration.getIllegalActivity())
                .healthContentServicePercent(contentModeration.getHealthContentService())
                .blockchainBasedContentPercent(contentModeration.getBlockchainBasedContent())
                .aiGeneratedContentPercent(contentModeration.getAiGeneratedContent())
                .build();
    }

    // 6단계: Packaging 정보를 조회합니다.
    private AcceptanceUncensoredPwaGetDetailResponse.PackagingStepDto getPackagingStepDto(Integer pwaId, String status) {
        // 리포지토리에서 각 파일 타입별 최신 파일 목록을 가져옵니다
        List<PwaFile> latestFiles = pwaFileRepository.findLatestFilesByPwaIdForEachType(pwaId);

        // 응답 DTO를 위한 빌더 생성
        AcceptanceUncensoredPwaGetDetailResponse.PackagingStepDto.PackagingStepDtoBuilder builder =
                AcceptanceUncensoredPwaGetDetailResponse.PackagingStepDto.builder().status(status);

        // 파일이 없는 경우 비어있는 목록으로 응답 객체 생성
        if (latestFiles == null || latestFiles.isEmpty()) {
            return builder.packagingData(Collections.emptyList()).build();
        }

        // 각 파일 정보를 PackagingData 객체로 변환하여 목록으로 만듭니다
        List<AcceptanceUncensoredPwaGetDetailResponse.PackagingData> packagingDataList = latestFiles.stream()
                .map(file -> AcceptanceUncensoredPwaGetDetailResponse.PackagingData.builder().downloadUrl(file.getDownloadUrl())
                        .fileSize(file.getFileSize()).fileType(String.valueOf(file.getFileType())).build())
                .collect(Collectors.toList());

        // 최종 응답 객체 생성
        return builder.packagingData(packagingDataList).build();
    }

    // 7단계: Lighthouse 검사
    public AcceptanceUncensoredPwaGetDetailResponse.LighthouseResultDto runLighthouseTest(String url) {
        log.info("Running Lighthouse test for URL: {}", url);

        try (var tempDirContext = new TempDirectoryContext()) {
            // 1. 임시 폴더 및 파일 생성
            Path tempDir = tempDirContext.getTempDir();
            Path outputFile = tempDir.resolve(UUID.randomUUID().toString() + ".json");

            // 2. Lighthouse 명령에 포함할 카테고리 결정
            List<String> categories = new ArrayList<>();
            categories.add("performance");
            categories.add("accessibility");
            categories.add("best-practices");
            categories.add("seo");
            String categoriesParam = String.join(",", categories);

            // 3. Lighthouse 명령 구성 - 플래그 추가
            List<String> command = new ArrayList<>();
            command.add("lighthouse");
            command.add(url);
            command.add("--output=json");
            command.add("--output-path=" + outputFile.toString());
            command.add("--chrome-flags=--headless --no-sandbox --disable-gpu --disable-dev-shm-usage --disable-software-rasterizer --disable-setuid-sandbox --disable-features=VizDisplayCompositor --disable-vulkan --ignore-certificate-errors");
            command.add("--max-wait-for-load=60000"); // 페이지 로드 대기 시간 증가
            if (!categoriesParam.isEmpty()) command.add("--only-categories=" + categoriesParam);

            // 디버깅을 위한 로그 추가
            log.info("Executing Lighthouse command: {}", String.join(" ", command));

            // 4. Lighthouse Test 시작
            ProcessBuilder processBuilder = new ProcessBuilder(command);
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            // 5. 실행 결과 로그 기록
            StringBuilder output = new StringBuilder();
            try (BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = br.readLine()) != null) {
                    log.info("Lighthouse process: {}", line);
                    output.append(line).append("\n");
                }
            }

            // 6. 타임아웃 처리
            boolean completed = process.waitFor(LIGHTHOUSE_TIMEOUT, TimeUnit.SECONDS);
            if (!completed) {
                process.destroyForcibly();
                throw new RuntimeException("테스트가 " + LIGHTHOUSE_TIMEOUT + "초 후 시간 초과되었습니다.");
            }

            if (process.exitValue() != 0) {
                String errorOutput = output.toString();
                log.warn("Lighthouse 테스트 실패: {}, 출력: {}", url, errorOutput);

                // 403 에러 감지
                if (errorOutput.contains("Status code: 403")) {
                    throw new RuntimeException("접근이 제한된 웹사이트입니다. 해당 사이트는 서버에서의 Lighthouse 테스트를 허용하지 않습니다.");
                } else {
                    throw new RuntimeException("테스트가 종료 코드 " + process.exitValue() + "로 실패했습니다.");
                }
            }

            // 7. 테스트 성공 + JSON 결과 파일 파싱
            log.info("Lighthouse test completed successfully");
            try (InputStream inputStream = Files.newInputStream(outputFile)) {
                JsonNode resultJson = objectMapper.readTree(inputStream);

                // LighthouseResultDto 객체 생성
                AcceptanceUncensoredPwaGetDetailResponse.LighthouseResultDto resultDto = new AcceptanceUncensoredPwaGetDetailResponse.LighthouseResultDto();
                resultDto.setStatus("NEED_CONFIRM");

                // 점수 추출 및 변환 (Lighthouse는 0-1 범위의 값을 반환하므로 0-100으로 변환)
                JsonNode categoriesNode = resultJson.path("categories");
                resultDto.setPerformanceScore(Math.round(categoriesNode.path("performance").path("score").floatValue() * 100));
                resultDto.setAccessibilityScore(Math.round(categoriesNode.path("accessibility").path("score").floatValue() * 100));
                resultDto.setBestPracticeScore(Math.round(categoriesNode.path("best-practices").path("score").floatValue() * 100));
                resultDto.setSeoScore(Math.round(categoriesNode.path("seo").path("score").floatValue() * 100));
                return resultDto;
            }
        } catch (Exception e) {
            log.error("Lighthouse 테스트 실행 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("Lighthouse 테스트에 어려움이 있는 사이트입니다. " + e.getMessage(), e);
        }
    }

    // 8단계: Security 정보를 조회합니다.
    private AcceptanceUncensoredPwaGetDetailResponse.SecurityStepDto getSecurityStepDto(Integer pwaId, String status) {
        Security security = securityRepository.findByPwaId(pwaId).orElse(null);

        if (security == null) {
            return AcceptanceUncensoredPwaGetDetailResponse.SecurityStepDto.builder().status(status).build();
        }

        return AcceptanceUncensoredPwaGetDetailResponse.SecurityStepDto.builder()
                .status(status).isHttpsActive(security.getHttps())
                .isCspActive(security.getCsp()).build();
    }
}