package com.ssafy.pwandora.language.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.pwandora.language.dto.response.LanguageGetResponse;
import com.ssafy.pwandora.language.service.LanguageService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/languages")
@RequiredArgsConstructor
public class LanguageController {
	private final LanguageService languageService;

	@Operation(summary = "언어 목록 전체 조회", description = "사용 가능한 언어에 대해 전체 조회 합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리")
	})
	@GetMapping("")
	public ResponseEntity<List<LanguageGetResponse>> getLanguages() {

		List<LanguageGetResponse> response = languageService.getLanguages();
		return ResponseEntity.ok(response);
	}
}
