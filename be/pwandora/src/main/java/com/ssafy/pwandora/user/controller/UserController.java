package com.ssafy.pwandora.user.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.pwandora.global.aop.user.CheckLogin;
import com.ssafy.pwandora.global.util.SessionUtil;
import com.ssafy.pwandora.pwa.entity.file.FileType;
import com.ssafy.pwandora.user.dto.request.UserLoginPostRequest;
import com.ssafy.pwandora.user.dto.request.UserSignupPostRequest;
import com.ssafy.pwandora.user.dto.response.UserInstalledPwasGetResponse;
import com.ssafy.pwandora.user.dto.response.UserLoginPostResponse;
import com.ssafy.pwandora.user.dto.response.UserMeGetResponse;
import com.ssafy.pwandora.user.dto.response.UserSignupPostResponse;
import com.ssafy.pwandora.user.entity.User;
import com.ssafy.pwandora.user.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
	private final UserService userService;

	@Operation(summary = "회원가입")
	@ApiResponses(value = {@ApiResponse(responseCode = "201", description = "정상 처리")})
	@PostMapping("/signup")
	public ResponseEntity<?> signup(@RequestBody UserSignupPostRequest signupDto) {
		userService.signup(signupDto);
		return ResponseEntity.status(HttpStatus.CREATED).body(new UserSignupPostResponse("회원가입 성공!"));
	}

	@Operation(summary = "로그인")
	@ApiResponses(value = {@ApiResponse(responseCode = "200", description = "정상 처리")})
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody UserLoginPostRequest loginDto, HttpSession session) {
		User user = userService.login(loginDto.getLoginId(), loginDto.getPassword());
		session.setAttribute("loggedInUser", user.getId());
		session.setMaxInactiveInterval(31536000);
		UserLoginPostResponse response = new UserLoginPostResponse(user.getId(), user.getLoginId());
		return ResponseEntity.ok(response);
	}

	@CheckLogin
	@Operation(summary = "사용자의 앱 목록 조회", description = "로그인한 사용자가 설치했거나 삭제한 PWA 앱 목록을 조회합니다.")
	@ApiResponses(value = {@ApiResponse(responseCode = "200", description = "정상 처리")})
	@GetMapping("/my-apps")
	public ResponseEntity<List<UserInstalledPwasGetResponse>> getMyApps(HttpSession session) {
		Integer userId = SessionUtil.getUserId(session);
		List<UserInstalledPwasGetResponse> myApps = userService.getMyPagePwaList(userId);
		return ResponseEntity.ok(myApps);
	}

	@CheckLogin
	@Operation(summary = "PWA 앱 다운로드", description = "사용자가 PWA 앱을 다운로드 합니다.")
	@ApiResponses(value = {@ApiResponse(responseCode = "204", description = "정상 처리")})
	@GetMapping("/pwa/{pwaId}")
	public ResponseEntity<Void> installPwa(@PathVariable Integer pwaId, @Parameter FileType fileType,
		HttpSession session) {
		Integer userId = SessionUtil.getUserId(session);
		userService.installPwa(userId, pwaId, fileType);
		return ResponseEntity.noContent().build();
	}

	@CheckLogin
	@Operation(summary = "PWA 앱 제거", description = "사용자가 PWA 앱을 제거합니다.")
	@ApiResponses(value = {@ApiResponse(responseCode = "204", description = "정상 처리")})
	@DeleteMapping("/pwa/{pwaId}")
	public ResponseEntity<Void> uninstallPwa(@PathVariable Integer pwaId, @Parameter FileType fileType,
		HttpSession session) {
		Integer userId = SessionUtil.getUserId(session);
		userService.uninstallPwa(userId, pwaId, fileType);
		return ResponseEntity.noContent().build();
	}

	@CheckLogin
	@Operation(summary = "유저 정보 조회", description = "현재 로그인된 유저 정보를 제공합니다.")
	@ApiResponses(value = {@ApiResponse(responseCode = "200", description = "정상 처리")})
	@GetMapping("/me")
	public ResponseEntity<UserMeGetResponse> getMe(HttpSession session) {
		Integer userId = SessionUtil.getUserId(session);
		UserMeGetResponse response = userService.getMe(userId);
		return ResponseEntity.ok(response);
	}

	@CheckLogin
	@Operation(summary = "로그아웃", description = "사용자가 로그아웃합니다.")
	@ApiResponses(value = {@ApiResponse(responseCode = "204", description = "정상 처리")})
	@PostMapping("/logout")
	public ResponseEntity<Void> logout(HttpSession session) {
		// 세션에서 사용자 정보 제거
		session.removeAttribute("loggedInUser");
		session.invalidate();  // 세션 종료 (세션 완전 삭제)

		return ResponseEntity.noContent().build();
	}

	@CheckLogin
	@Operation(summary = "유저 언어 정보 수정", description = "현재 로그인된 유저 언어 설정을 수정 합니다.")
	@ApiResponses(value = {@ApiResponse(responseCode = "204", description = "정상 처리")})
	@PatchMapping("/language")
	public ResponseEntity<Void> modifyLanguage(HttpSession session, @Parameter Integer languageId) {
		Integer userId = SessionUtil.getUserId(session);
		userService.updateLanguage(userId, languageId);
		return ResponseEntity.noContent().build();
	}
}