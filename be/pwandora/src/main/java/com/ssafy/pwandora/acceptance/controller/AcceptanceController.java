package com.ssafy.pwandora.acceptance.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.pwandora.acceptance.dto.request.AcceptanceRegisterPostRequest;
import com.ssafy.pwandora.acceptance.dto.response.AcceptanceUncensoredPwaGetDetailResponse;
import com.ssafy.pwandora.acceptance.dto.response.AcceptanceUncensoredPwaGetResponse;
import com.ssafy.pwandora.acceptance.service.AcceptanceService;
import com.ssafy.pwandora.global.dto.CommonPageRequest;
import com.ssafy.pwandora.global.dto.CommonPageResponse;
import com.ssafy.pwandora.global.util.SessionUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/acceptance")
@RequiredArgsConstructor
@Tag(name = "Acceptance API", description = "PWA 앱 검수 관련 API")
public class AcceptanceController {

    private final AcceptanceService acceptanceService;
    private final ObjectMapper objectMapper;

    @Operation(summary = "검수가 필요한 PWA 앱 목록 조회", description = "acceptanceStatus가 NONE인 PWA 앱 목록을 페이지네이션으로 조회합니다. 사이드바에 표시할 앱 목록을 위한 API입니다.")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "정상 처리")})
    @GetMapping("/uncensored")
    public ResponseEntity<CommonPageResponse<AcceptanceUncensoredPwaGetResponse>> getUncensoredPwas(HttpSession session, CommonPageRequest pageRequest) {
        Integer userId = SessionUtil.getUserId(session);
        CommonPageResponse<AcceptanceUncensoredPwaGetResponse> response = acceptanceService.getUncensoredPwas(userId, pageRequest.toPageable());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "검수할 대상 PWA 앱 상세 조회", description = "PWA 앱의 각 단계별로 검수할 정보들을 조회합니다.")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "정상 처리")})
    @GetMapping("/uncensored/{pwaId}")
    public ResponseEntity<AcceptanceUncensoredPwaGetDetailResponse> getUncensoredPwaDetail(HttpSession session, @PathVariable("pwaId") Integer pwaId) {
        Integer userId = SessionUtil.getUserId(session);
        AcceptanceUncensoredPwaGetDetailResponse response = acceptanceService.getPwaAcceptanceDetail(userId, pwaId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Lighthouse 테스트", description = "검수할 PWA 앱의 Lighthouse 검사 지표를 요청합니다.")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "정상 처리")})
    @GetMapping("/lighthouse")
    public ResponseEntity<AcceptanceUncensoredPwaGetDetailResponse.LighthouseResultDto> runLighthouseTest(@RequestParam("url") String url) {
        // Lighthouse 테스트 실행 및 결과 반환
        AcceptanceUncensoredPwaGetDetailResponse.LighthouseResultDto result = acceptanceService.runLighthouseTest(url);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "검수 등록(Register) API", description = "검수를 마친 PWA 앱을 등록합니다.")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "정상 처리")})
    @PostMapping("/register/{pwaId}")
    public ResponseEntity<?> registerPWAApp(@PathVariable Integer pwaId, @RequestPart("request") String requestStr,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) throws JsonProcessingException {

        // JSON 문자열을 객체로 변환
        AcceptanceRegisterPostRequest request = objectMapper.readValue(requestStr, AcceptanceRegisterPostRequest.class);

        // 이미지 설정
        if (request.getScreenShotDto() != null) {
            request.getScreenShotDto().setImages(images);
        }

        acceptanceService.updatePwaAcceptance(pwaId, request);
        return ResponseEntity.ok().build();
    }
}