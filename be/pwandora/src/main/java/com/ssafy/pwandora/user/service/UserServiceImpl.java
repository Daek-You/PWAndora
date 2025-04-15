package com.ssafy.pwandora.user.service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.pwandora.language.entity.Language;
import com.ssafy.pwandora.language.repository.LanguageRepository;
import com.ssafy.pwandora.pwa.entity.AcceptanceStatus;
import com.ssafy.pwandora.pwa.entity.Content;
import com.ssafy.pwandora.pwa.entity.Pwa;
import com.ssafy.pwandora.pwa.entity.category.CategoryContent;
import com.ssafy.pwandora.pwa.entity.file.FileType;
import com.ssafy.pwandora.pwa.repository.PwaRepository;
import com.ssafy.pwandora.user.dto.request.UserSignupPostRequest;
import com.ssafy.pwandora.user.dto.response.UserInstalledPwasGetResponse;
import com.ssafy.pwandora.user.dto.response.UserMeGetResponse;
import com.ssafy.pwandora.user.entity.Role;
import com.ssafy.pwandora.user.entity.User;
import com.ssafy.pwandora.user.entity.UserPwa;
import com.ssafy.pwandora.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
	private final UserRepository userRepository;
	private final PwaRepository pwaRepository;
	private final PasswordEncoder passwordEncoder;
	private final LanguageRepository languageRepository;

	private static final int BASE_LANGUAGE_ID = 1;

	@Override
	@Transactional
	public void signup(UserSignupPostRequest signupDto) {

		// 1. 아이디 중복 검사
		if (checkLoginIdDuplicate(signupDto.getLoginId())) {
			throw new RuntimeException("이미 사용 중인 아이디입니다.");
		}

		// 2. 비밀번호 암호화
		String encodedPassword = passwordEncoder.encode(signupDto.getPassword());

		// 3. 사용자 언어 조회
		Language language = languageRepository.findById(signupDto.getLanguageId()).orElseThrow();

		// 4. User Entity 생성 (비밀번호 암호화는 우선 고려 X)
		User user = User.builder().loginId(signupDto.getLoginId())
			.password(encodedPassword)
			.language(language)
			.email(signupDto.getEmail())
			.role(Role.USER).build();

		// 4. 데이터베이스에 저장
		userRepository.save(user);
	}

	// 아이디 중복 체크
	@Override
	@Transactional(readOnly = true)
	public boolean checkLoginIdDuplicate(String loginId) {
		return userRepository.existsByLoginId(loginId);
	}

	@Override
	public User login(String loginId, String password) {
		// 1. 아이디로 사용자 찾기
		User user = userRepository.findByLoginId(loginId).orElseThrow(() -> new RuntimeException("회원 정보가 존재하지 않습니다."));

		// 2. 비밀번호 일치 여부 확인
		if (!passwordEncoder.matches(password, user.getPassword())) {
			throw new RuntimeException("비밀번호가 일치하지 않습니다.");
		}

		// 3. 탈퇴한 회원인지 확인
		if (user.getDeletedAt() != null) {
			throw new RuntimeException("탈퇴한 회원입니다.");
		}

		// 4. 로그인 성공 시, 사용자 정보 반환
		return user;
	}

	@Override
	public void withdraw(Integer userId) {

	}

	// 설치한 앱 조회
	@Override
	public List<UserInstalledPwasGetResponse> getMyPagePwaList(Integer userId) {
		// 1. 사용자의 앱 목록 조회
		User user = userRepository.findById(userId).orElseThrow();
		List<UserPwa> userPwas = userRepository.findMyPagePwasByUserId(userId);

		// 앱이 없으면 빈 리스트 반환
		if (userPwas.isEmpty()) {
			return Collections.emptyList();
		}

		// 2. pwaId 기준으로 중복 제거 (DeletedAt이 null인 값 우선, 없으면 최신 DownloadAt 기준)
		Map<Integer, UserPwa> pwaMap = userPwas.stream()
			.collect(Collectors.toMap(
				up -> up.getPwa().getId(), // pwaId를 키로 사용
				up -> up,                  // UserPwa 객체 저장
				(existing, replacement) -> {
					// DeletedAt이 null인 값 우선 선택
					if (existing.getDeletedAt() == null && replacement.getDeletedAt() != null) {
						return existing;
					}
					if (existing.getDeletedAt() != null && replacement.getDeletedAt() == null) {
						return replacement;
					}
					// 둘 다 null이거나 둘 다 삭제된 경우, 최신 DownloadAt 기준으로 선택
					return existing.getDownloadAt().isAfter(replacement.getDownloadAt()) ? existing : replacement;
				}
			));

		// 3. 응답 DTO 생성
		return pwaMap.values().stream()
			.map(userPwa -> {
				Pwa pwa = userPwa.getPwa();
				Integer pwaId = pwa.getId();

				// 사용자의 언어에 맞는 content 찾기
				Content content = pwa.getContents().stream()
					.filter(c -> c.getLanguage().equals(user.getLanguage()))
					.findFirst()
					.orElse(pwa.getContents().stream()
						.filter(c -> c.getLanguage().getId() == BASE_LANGUAGE_ID)
						.findFirst()
						.orElseGet(() -> Content.builder().build()));

				return UserInstalledPwasGetResponse.builder()
					.id(pwaId)
					.name(content.getName())
					.iconImage(pwa.getIconImage())
					.downloadCount(formatDownloadCount(pwa.getDownloadCount()))
					.isInstalled(userPwa.getDeletedAt() == null)
					.downloadUrl(userPwa.getPwa().getPwaFile(userPwa.getFileType()).getDownloadUrl())
					.appId(pwa.getAppId())

					.categories(pwa.getPwaCategories().stream()
						.map(pc -> {

							// 사용자의 언어에 맞는 category ontent 찾기
							CategoryContent categoryContent = pc.getCategory().getCategoryContents().stream()
								.filter(cc -> cc.getLanguage().equals(user.getLanguage()))
								.findFirst()
								.orElse(pc.getCategory().getCategoryContents().stream()
									.filter(cc -> cc.getLanguage().getId() == BASE_LANGUAGE_ID)
									.findFirst()
									.orElseThrow(() -> new RuntimeException("지원하지 않는 언어")));

							return UserInstalledPwasGetResponse.CategoryDto.builder()
								.name(categoryContent.getName())
								.categoryOrder(pc.getCategory().getCategoryOrder())
								.build();
						})
						.collect(Collectors.toList()))

					.files(pwa.getFiles().stream()
						.map(f -> UserInstalledPwasGetResponse.FileDto.builder()
							.downloadUrl(f.getDownloadUrl())
							.fileSize(f.getFileSize())
							.fileType(f.getFileType())
							.build())
						.collect(Collectors.toList()))
					.build();
			})
			.collect(Collectors.toList());
	}

	private String formatDownloadCount(Integer count) {
		if (count == null)
			return "0";
		if (count >= 1000000) {
			return (count / 1000000) + "M+";
		} else if (count >= 1000) {
			return (count / 1000) + "K+";
		}

		return count.toString();
	}

	@Override
	@Transactional
	public void installPwa(Integer userId, Integer pwaId, FileType fileType) {
		User user = userRepository.findById(userId).orElseThrow();
		Pwa pwa = pwaRepository.findByIdWithDetails(pwaId, false, AcceptanceStatus.ACCEPTED).orElseThrow();

		// 최초 다운로드라면 생성
		user.updateApp(pwa, fileType);

		// pwa 다운로드 횟수 증가
		pwa.countDownload();
	}

	@Override
	@Transactional
	public void uninstallPwa(Integer userId, Integer pwaId, FileType fileType) {

		User user = userRepository.findById(userId).orElseThrow();
		Pwa pwa = pwaRepository.findByIdWithDetails(pwaId, false, AcceptanceStatus.ACCEPTED).orElseThrow();

		user.deleteApp(pwa, fileType);
	}

	@Override
	@Transactional
	public UserMeGetResponse getMe(Integer userId) {

		User user = userRepository.findById(userId).orElseThrow();
		return UserMeGetResponse.builder()
			.languageId(user.getLanguage().getId())
			.languageName(user.getLanguage().getName())
			.languageCode(user.getLanguage().getCode())
			.build();
	}

	@Override
	@Transactional
	public void updateLanguage(Integer userId, Integer languageId) {
		User user = userRepository.findById(userId).orElseThrow();
		Language language = languageRepository.findById(languageId).orElseThrow();

		user.setLanguage(language);
	}
}
