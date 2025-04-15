package com.ssafy.pwandora.user.service;

import java.util.List;

import com.ssafy.pwandora.pwa.entity.file.FileType;
import com.ssafy.pwandora.user.dto.request.UserSignupPostRequest;
import com.ssafy.pwandora.user.dto.response.UserInstalledPwasGetResponse;
import com.ssafy.pwandora.user.dto.response.UserMeGetResponse;
import com.ssafy.pwandora.user.entity.User;

public interface UserService {
	void signup(UserSignupPostRequest signupDto);              // 회원가입 처리

	boolean checkLoginIdDuplicate(String loginId);             // 로그인 ID 중복 체크

	User login(String loginId, String password);               // 로그인 처리

	void withdraw(Integer userId);                             // 회원 탈퇴 처리

	List<UserInstalledPwasGetResponse> getMyPagePwaList(Integer userId);  // 마이페이지 조회

	void installPwa(Integer userId, Integer pwaId, FileType fileType);

	void uninstallPwa(Integer userId, Integer pwaId, FileType fileType);

	UserMeGetResponse getMe(Integer userId);

	void updateLanguage(Integer userId, Integer languageId);
}
