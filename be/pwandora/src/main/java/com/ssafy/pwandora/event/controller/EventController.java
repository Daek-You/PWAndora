package com.ssafy.pwandora.event.controller;

import java.util.List;

import com.ssafy.pwandora.global.aop.user.CheckLogin;
import com.ssafy.pwandora.global.util.SessionUtil;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.pwandora.event.dto.response.EventGetResponse;
import com.ssafy.pwandora.event.service.EventService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

	private final EventService eventService;

	@CheckLogin
	@Operation(summary = "이벤트 조회(로그인해야 사용가능)", description = "현재 게시중인 이벤트를 조회합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "정상 처리")
	})
	@GetMapping("")
	public ResponseEntity<List<EventGetResponse>> getEvents(HttpSession session) {
		Integer userId = SessionUtil.getUserId(session);
		List<EventGetResponse> response = eventService.getEvents(userId);
		return ResponseEntity.ok(response);
	}
}
