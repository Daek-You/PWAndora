package com.ssafy.pwandora.pwa.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.pwandora.global.aop.user.CheckLogin;
import com.ssafy.pwandora.global.dto.CommonPageResponse;
import com.ssafy.pwandora.global.util.SessionUtil;
import com.ssafy.pwandora.pwa.dto.request.PwaAcceptancePostRequest;
import com.ssafy.pwandora.pwa.dto.request.PwaAdminDetailGetRequest;
import com.ssafy.pwandora.pwa.dto.request.PwaAdminSearchGetRequest;
import com.ssafy.pwandora.pwa.dto.request.PwaContentPatchRequest;
import com.ssafy.pwandora.pwa.dto.request.PwaPatchRequest;
import com.ssafy.pwandora.pwa.dto.request.PwaScreenshotPutRequest;
import com.ssafy.pwandora.pwa.dto.response.PwaAdminDetailGetResponse;
import com.ssafy.pwandora.pwa.dto.response.PwaAdminSearchGetResponse;
import com.ssafy.pwandora.pwa.dto.response.PwaCategoryCountGetResponse;
import com.ssafy.pwandora.pwa.dto.response.PwaDailyStatsGetResponse;
import com.ssafy.pwandora.pwa.dto.response.PwaStackStatsGetResponse;
import com.ssafy.pwandora.pwa.dto.response.PwaTotalStatsGetResponse;
import com.ssafy.pwandora.pwa.service.PwaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/monitor")
@RequiredArgsConstructor
public class PwaMonitoringController {

	private final PwaService pwaService;

	@Operation(summary = "PWA 상태 조회", description = "앱에 대한 전체 카운트를 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리")
	})
	@GetMapping("/stats/total")
	public ResponseEntity<PwaTotalStatsGetResponse> getPwaDashboard() {
		PwaTotalStatsGetResponse response = pwaService.getPwaDashBoardV2();
		return ResponseEntity.ok(response);
	}

	@CheckLogin
	@Operation(summary = "PWA 카테고리별 조회", description = "카테리고리 수집된 앱 수에 대해 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리")
	})
	@GetMapping("/category/count")
	public ResponseEntity<List<PwaCategoryCountGetResponse>> getCategoryCountsByUserLanguage(HttpSession session) {
		Integer userId = SessionUtil.getUserId(session);

		List<PwaCategoryCountGetResponse> categoryCounts = pwaService.getCategoryCounts(userId);
		return ResponseEntity.ok(categoryCounts);
	}

	@Operation(summary = "PWA 일일 단위 상태 정보 제공", description = "일일단위로 상태 정보를 제공합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리")
	})
	@GetMapping("/stats")
	public ResponseEntity<List<PwaDailyStatsGetResponse>> getPwaDailyStatsFor(@RequestParam Integer day) {
		List<PwaDailyStatsGetResponse> dailyStats = pwaService.getDailyStatsFor(day);
		return ResponseEntity.ok(dailyStats);
	}

	@Operation(summary = "PWA 누적 단위 상태 정보 제공", description = "누적단위로 상태 정보를 제공합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리")
	})
	@GetMapping("/stack/stats")
	public ResponseEntity<List<PwaStackStatsGetResponse>> getPwaStackStatsFor(@RequestParam Integer day) {
		List<PwaStackStatsGetResponse> dailyStats = pwaService.getStackStatsFor(day);
		return ResponseEntity.ok(dailyStats);
	}

	@CheckLogin
	@Operation(
		summary = "관리자용 PWA 검색 조회",
		description = "PWA에 대해 검색합니다. "
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
	public CommonPageResponse<PwaAdminSearchGetResponse> searchPwas(HttpSession session,
		PwaAdminSearchGetRequest request) {
		Integer userId = SessionUtil.getUserId(session);
		return CommonPageResponse.from(pwaService.searchAdminPwas(userId, request));
	}

	@CheckLogin
	@Operation(summary = "관리자용 PWA 상세 조회", description = "특정 Pwa 에 대해 상세 조회를 합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리")
	})
	@GetMapping("/{pwaId}")
	public ResponseEntity<PwaAdminDetailGetResponse> getPwaById(HttpSession session, @PathVariable Integer pwaId,
		PwaAdminDetailGetRequest request) {
		Integer userId = SessionUtil.getUserId(session);
		PwaAdminDetailGetResponse response = pwaService.getAdminPwaById(userId, pwaId, request);
		return ResponseEntity.ok(response);
	}

	@Operation(summary = "PWA 차단", description = "특정 Pwa 를 차단합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "204", description = "정상 처리")
	})
	@DeleteMapping("/block/{id}")
	public ResponseEntity<Void> blockPwaById(@PathVariable Integer id) {
		pwaService.blockPwa(id);
		return ResponseEntity.noContent().build();
	}

	@Operation(summary = "PWA 차단 해제", description = "특정 Pwa 를 차단을 해제 합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "204", description = "정상 처리")
	})
	@PostMapping("/block/{id}")
	public ResponseEntity<Void> unblockPwaById(@PathVariable Integer id) {
		pwaService.unblockPwa(id);
		return ResponseEntity.noContent().build();
	}

	@Operation(summary = "PWA 승인 상태 변경", description = "특정 Pwa 승인, 거절 합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "204", description = "정상 처리")
	})
	@PostMapping("/acceptance/{id}")
	public ResponseEntity<Void> updateAcceptance(@PathVariable Integer id, PwaAcceptancePostRequest request) {
		pwaService.updateAcceptance(id, request);
		return ResponseEntity.noContent().build();
	}

	@Operation(summary = "PWA 관리자용 업데이트", description = "PWA 에 기본정보에 관리자가 수정합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "204", description = "정상 처리")
	})
	@PatchMapping("/{id}")
	public ResponseEntity<Void> updatePwa(@PathVariable Integer id, @RequestBody PwaPatchRequest request) {
		pwaService.updatePwa(id, request);
		return ResponseEntity.noContent().build();
	}

	@Operation(summary = "PWA Content 관리자용 업데이트", description = "PWA Content 에 대해 관리자가 수정합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "204", description = "정상 처리")
	})
	@PatchMapping("/{pwaId}/{languageId}")
	public ResponseEntity<Void> updatePwa(@PathVariable Integer pwaId,
		@PathVariable Integer languageId,
		@RequestBody PwaContentPatchRequest request) {
		pwaService.updatePwaContent(pwaId, languageId, request);
		return ResponseEntity.noContent().build();
	}

	@Operation(summary = "[Swagger 테스트 불가] PWA Screenshot 관리자용 업데이트", description = "PWA Screenshot 에 대해 관리자가 수정합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "204", description = "정상 처리")
	})
	@PutMapping("/{pwaId}/screenshot")
	public ResponseEntity<Void> updatePwa(@PathVariable Integer pwaId,
		@RequestPart PwaScreenshotPutRequest request,
		@RequestPart List<MultipartFile> images) {
		pwaService.updatePwaScreenshot(pwaId, request, images);
		return ResponseEntity.noContent().build();
	}
}
