package com.ssafy.pwandora.pwa.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.pwandora.global.aop.user.CheckLogin;
import com.ssafy.pwandora.global.dto.CommonPageResponse;
import com.ssafy.pwandora.global.util.SessionUtil;
import com.ssafy.pwandora.pwa.dto.request.PwaSearchGetRequest;
import com.ssafy.pwandora.pwa.dto.response.PwaCategoryGetResponse;
import com.ssafy.pwandora.pwa.dto.response.PwaDetailGetResponse;
import com.ssafy.pwandora.pwa.dto.response.PwaSearchGetResponse;
import com.ssafy.pwandora.pwa.service.PwaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pwas")
@RequiredArgsConstructor
public class PwaController {

	private final PwaService pwaService;

	@CheckLogin
	@Operation(summary = "PWA 검색 조회",
		description = "PWA 에 대해 검색합니다. "
			+ "기본값 : page=0, size=20, sortCriteria=createdAt, sortDirection=DESC 로 설정되어 있습니다.",
		parameters = {
			@Parameter(name = "sortCriteria",
				description = "정렬 기준 (가능한 값: id, appId, avgScore, downloadCount, version, company, createdAt, updatedAt, acceptedAt, blockedAt)",
				example = "createdAt")
		}
	)
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리"),
	})
	@GetMapping("/search")
	public CommonPageResponse<PwaSearchGetResponse> searchPwas(HttpSession session, PwaSearchGetRequest request) {
		Integer userId = SessionUtil.getUserId(session);
		return CommonPageResponse.from(pwaService.searchPwas(userId, request));
	}

	@CheckLogin
	@Operation(summary = "PWA 상세 조회", description = "특정 Pwa 에 대해 상세 조회를 합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리")
	})
	@GetMapping("/{pwaId}")
	public ResponseEntity<PwaDetailGetResponse> getPwaById(HttpSession session, @PathVariable Integer pwaId) {
		Integer userId = SessionUtil.getUserId(session);
		PwaDetailGetResponse response = pwaService.getPwaById(userId, pwaId);
		return ResponseEntity.ok(response);
	}

	@CheckLogin
	@Operation(summary = "PWA 카테고리 목록 조회", description = "카테고리 전체 목록에 대해 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리")
	})
	@GetMapping("/categories")
	public ResponseEntity<List<PwaCategoryGetResponse>> getCategories(HttpSession session) {
		Integer userId = SessionUtil.getUserId(session);

		List<PwaCategoryGetResponse> response = pwaService.getCategories(userId);
		return ResponseEntity.ok(response);
	}

	@CheckLogin
	@Operation(summary = "PWA 카테고리 목록 조회 (언어 선택 가능)", description = "카테고리 전체 목록에 대해, 선택한 언어로 조회합니다.")
	@ApiResponses(value = {@ApiResponse(responseCode = "200", description = "정상 처리")})
	@GetMapping("/categories/{languageCode}")
	public ResponseEntity<List<PwaCategoryGetResponse>> getCategoriesByLanguageCode(HttpSession session, @PathVariable("languageCode") String languageCode) {
		Integer userId = SessionUtil.getUserId(session);
		List<PwaCategoryGetResponse> response = pwaService.getCategoriesByLanguageCode(userId, languageCode);
		return ResponseEntity.ok(response);
	}

}
