package com.ssafy.pwandora.pwa.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import com.ssafy.pwandora.pwa.entity.category.Category;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.pwandora.file.service.FileService;
import com.ssafy.pwandora.language.entity.Language;
import com.ssafy.pwandora.language.repository.LanguageRepository;
import com.ssafy.pwandora.pwa.dto.request.PwaAcceptancePostRequest;
import com.ssafy.pwandora.pwa.dto.request.PwaAdminDetailGetRequest;
import com.ssafy.pwandora.pwa.dto.request.PwaAdminSearchGetRequest;
import com.ssafy.pwandora.pwa.dto.request.PwaContentPatchRequest;
import com.ssafy.pwandora.pwa.dto.request.PwaPatchRequest;
import com.ssafy.pwandora.pwa.dto.request.PwaScreenshotPutRequest;
import com.ssafy.pwandora.pwa.dto.request.PwaSearchGetRequest;
import com.ssafy.pwandora.pwa.dto.response.PwaAdminDetailGetResponse;
import com.ssafy.pwandora.pwa.dto.response.PwaAdminSearchGetResponse;
import com.ssafy.pwandora.pwa.dto.response.PwaCategoryCountGetResponse;
import com.ssafy.pwandora.pwa.dto.response.PwaCategoryGetResponse;
import com.ssafy.pwandora.pwa.dto.response.PwaDailyStatsGetResponse;
import com.ssafy.pwandora.pwa.dto.response.PwaDetailGetResponse;
import com.ssafy.pwandora.pwa.dto.response.PwaSearchGetResponse;
import com.ssafy.pwandora.pwa.dto.response.PwaStackStatsGetResponse;
import com.ssafy.pwandora.pwa.dto.response.PwaTotalStatsGetResponse;
import com.ssafy.pwandora.pwa.entity.AcceptanceStatus;
import com.ssafy.pwandora.pwa.entity.Content;
import com.ssafy.pwandora.pwa.entity.Pwa;
import com.ssafy.pwandora.pwa.entity.category.CategoryContent;
import com.ssafy.pwandora.pwa.entity.screenshot.Screenshot;
import com.ssafy.pwandora.pwa.entity.site.PwaStatus;
import com.ssafy.pwandora.pwa.repository.PwaRepository;
import com.ssafy.pwandora.pwa.repository.content.ContentRepository;
import com.ssafy.pwandora.pwa.repository.pwacategory.CategoryRepository;
import com.ssafy.pwandora.pwa.repository.pwacategory.PwaCategoryRepository;
import com.ssafy.pwandora.pwa.repository.site.SiteRepository;
import com.ssafy.pwandora.user.entity.User;
import com.ssafy.pwandora.user.repository.UserPwaRepository;
import com.ssafy.pwandora.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Transactional
@Service
public class PwaService {

	private final PwaRepository pwaRepository;
	private final SiteRepository siteRepository;
	private final PwaCategoryRepository pwaCategoryRepository;
	private final CategoryRepository categoryRepository;
	private final UserRepository userRepository;
	private final ContentRepository contentRepository;
	private final UserPwaRepository userPwaRepository;
	private final LanguageRepository languageRepository;
	private final FileService fileService;

	private static final int BASE_LANGUAGE_ID = 1;

	public Page<PwaSearchGetResponse> searchPwas(Integer userId, PwaSearchGetRequest request) {
		Page<Pwa> pwaPage = pwaRepository.searchPwas(request, false, AcceptanceStatus.ACCEPTED);
		User user = userRepository.findById(userId).orElseThrow();

		return pwaPage.map(pwa -> {

			// 사용자의 언어에 맞는 content 찾기
			Content content = pwa.getContents().stream()
				.filter(c -> c.getLanguage().equals(user.getLanguage()))
				.findFirst()
				.orElse(pwa.getContents().stream()
					.filter(c -> c.getLanguage().getId() == BASE_LANGUAGE_ID)
					.findFirst()
					.orElseGet(() -> Content.builder().build()));

			return PwaSearchGetResponse.builder()
				.id(pwa.getId())
				.iconImage(pwa.getIconImage())
				.name(content.getName())
				.summary(content.getSummary())
				.description(content.getDescription())
				.downloadCount(pwa.getDownloadCount())
				.appId(pwa.getAppId())
				.categories(pwa.getPwaCategories().stream()
					.map(category -> {

						// 사용자의 언어에 맞는 category ontent 찾기
						CategoryContent categoryContent = category.getCategory().getCategoryContents().stream()
							.filter(cc -> cc.getLanguage().equals(user.getLanguage()))
							.findFirst()
							.orElse(category.getCategory().getCategoryContents().stream()
								.filter(cc -> cc.getLanguage().getId() == BASE_LANGUAGE_ID)
								.findFirst()
								.orElseThrow(() -> new RuntimeException("지원하지 않는 언어")));

						return PwaSearchGetResponse.CategoryDto.builder()
							.name(categoryContent.getName())
							.categoryOrder(category.getCategory().getCategoryOrder())
							.build();
					})
					.collect(Collectors.toList()))

				.files(pwa.getFiles().stream()
					.map(f -> PwaSearchGetResponse.FileDto.builder()
						.downloadUrl(f.getDownloadUrl())
						.fileSize(f.getFileSize())
						.fileType(f.getFileType())
						.build())
					.collect(Collectors.toList()))
				.build();
		});
	}

	public PwaDetailGetResponse getPwaById(Integer userId, Integer id) {
		Pwa pwa = pwaRepository.findByIdWithDetails(id, false, AcceptanceStatus.ACCEPTED).orElseThrow();
		User user = userRepository.findById(userId).orElseThrow();

		// 사용자의 언어에 맞는 content 찾기
		Content content = pwa.getContents().stream()
			.filter(c -> c.getLanguage().equals(user.getLanguage()))
			.findFirst()
			.orElse(pwa.getContents().stream()
				.filter(c -> c.getLanguage().getId() == BASE_LANGUAGE_ID)
				.findFirst()
				.orElseGet(() -> Content.builder().build()));

		return PwaDetailGetResponse.builder()
			.id(pwa.getId())
			.iconImage(pwa.getIconImage())
			.name(content.getName())
			.summary(content.getSummary())
			.description(content.getDescription())
			.websiteUrl(pwa.getWebsiteUrl())
			.avgScore(pwa.getAvgScore())
			.downloadCount(pwa.getDownloadCount())
			.version(pwa.getVersion())
			.company(pwa.getCompany())
			.developerSite(pwa.getDeveloperSite())
			.ageLimit(pwa.getAgeLimit().getName())
			.appId(pwa.getAppId())

			.display(pwa.getDisplay() != null ?
				PwaDetailGetResponse.DisplayDto.builder()
					.isLarge(pwa.getDisplay().getIsLarge())
					.isMedium(pwa.getDisplay().getIsMedium())
					.isMediumSmall(pwa.getDisplay().getIsMediumSmall())
					.isSmall(pwa.getDisplay().getIsSmall())
					.imageUrlLarge(pwa.getDisplay().getImageUrlLarge())
					.imageUrlMedium(pwa.getDisplay().getImageUrlMedium())
					.imageUrlSmall(pwa.getDisplay().getImageUrlSmall())
					.build()
				: null)

			.screenshots(pwa.getScreenshots().stream()
				.map(screenshot -> PwaDetailGetResponse.ScreenshotDto.builder()
					.imageUrl(screenshot.getImageUrl())
					.screenshotOrder(screenshot.getScreenshotOrder())
					.build())
				.collect(Collectors.toList()))

			.categories(pwa.getPwaCategories().stream()
				.map(pc -> {

					// 사용자의 언어에 맞는 category content 찾기
					CategoryContent categoryContent = pc.getCategory().getCategoryContents().stream()
						.filter(cc -> cc.getLanguage().equals(user.getLanguage()))
						.findFirst()
						.orElse(pc.getCategory().getCategoryContents().stream()
							.filter(cc -> cc.getLanguage().getId() == BASE_LANGUAGE_ID)
							.findFirst()
							.orElseThrow(() -> new RuntimeException("지원하지 않는 언어")));

					return PwaDetailGetResponse.CategoryDto.builder()
						.name(categoryContent.getName())
						.categoryOrder(pc.getCategory().getCategoryOrder())
						.build();
				})
				.collect(Collectors.toList()))

			.hashtags(pwa.getPwaHashtags().stream()
				.map(ph -> PwaDetailGetResponse.HashtagDto.builder()
					.name(ph.getHashtag().getName())
					.build())
				.collect(Collectors.toList()))

			.languages(pwa.getPwaLanguages().stream()
				.map(pl -> PwaDetailGetResponse.LanguageDto.builder()
					.name(pl.getLanguage().getName())
					.code(pl.getLanguage().getCode())
					.build())
				.collect(Collectors.toList()))

			.permissions(pwa.getPwaPermissions().stream()
				.map(pp -> PwaDetailGetResponse.PermissionDto.builder()
					.name(pp.getPermission().getName())
					.isRequired(pp.getIsRequired())
					.build())
				.collect(Collectors.toList()))

			.files(pwa.getFiles().stream()
				.map(f -> PwaDetailGetResponse.FileDto.builder()
					.downloadUrl(f.getDownloadUrl())
					.fileSize(f.getFileSize())
					.fileType(f.getFileType())
					.build())
				.collect(Collectors.toList()))

			.build();
	}

	public PwaTotalStatsGetResponse getPwaDashBoard() {

		Long siteCount = siteRepository.count();
		Long noneSiteCount = siteRepository.countByStatus(PwaStatus.NONE);
		Long pwaCount = siteRepository.countByStatus(PwaStatus.CONFIRM);
		Long noPwaCount = siteRepository.countByStatus(PwaStatus.NO_PWA);
		Long totalDownloadCount = userPwaRepository.getDownloadCountV2();
		Long blockedPwaCount = pwaRepository.countByBlockedAtIsNotNull();

		// 전날 데이터 조회
		LocalDateTime today = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
		LocalDateTime yesterday = today.minusDays(1);

		Long siteCountYesterday = siteRepository.countSitesByDate(yesterday, today);
		Long noneSiteCountYesterday = siteRepository.countSitesByStatusAndDate(PwaStatus.NONE, yesterday, today);
		Long pwaCountYesterday = siteRepository.countSitesByStatusAndDate(PwaStatus.CONFIRM, yesterday, today);
		Long noPwaCountYesterday = siteRepository.countSitesByStatusAndDate(PwaStatus.NO_PWA, yesterday, today);
		Long totalDownloadCountYesterday = userPwaRepository.getDownloadCountByDateV2(yesterday, today);
		Long blockedPwaCountYesterday = pwaRepository.countBlockedPwaByDate(yesterday, today);

		return PwaTotalStatsGetResponse.builder()
			.siteCount(siteCount)
			.siteCountDelta(siteCount - siteCountYesterday)
			.noneSiteCount(noneSiteCount)
			.noneSiteCountDelta(noneSiteCount - noneSiteCountYesterday)
			.pwaCount(pwaCount)
			.pwaCountDelta(pwaCount - pwaCountYesterday)
			.noPwaCount(noPwaCount)
			.noPwaCountDelta(noPwaCount - noPwaCountYesterday)
			.totalDownloadCount(totalDownloadCount)
			.totalDownloadCountDelta(totalDownloadCount - totalDownloadCountYesterday)
			.blockedPwaCount(blockedPwaCount)
			.blockedPwaCountDelta(blockedPwaCount - blockedPwaCountYesterday)
			.build();
	}

	public PwaTotalStatsGetResponse getPwaDashBoardV2() {

		// 비동기 실행으로 개별 쿼리 최적화
		CompletableFuture<Long> siteCountFuture = CompletableFuture.supplyAsync(siteRepository::count);
		CompletableFuture<Long> noneSiteCountFuture = CompletableFuture.supplyAsync(
			() -> siteRepository.countByStatus(PwaStatus.NONE));
		CompletableFuture<Long> pwaCountFuture = CompletableFuture.supplyAsync(
			() -> siteRepository.countByStatus(PwaStatus.CONFIRM));
		CompletableFuture<Long> noPwaCountFuture = CompletableFuture.supplyAsync(
			() -> siteRepository.countByStatus(PwaStatus.NO_PWA));
		CompletableFuture<Long> totalDownloadCountFuture = CompletableFuture.supplyAsync(
			userPwaRepository::getDownloadCountV2);
		CompletableFuture<Long> blockedPwaCountFuture = CompletableFuture.supplyAsync(
			pwaRepository::countByBlockedAtIsNotNull);

		// 현재 날짜 및 다음 날짜 설정
		LocalDateTime startDate = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
		LocalDateTime endDate = startDate.plusDays(1);

		CompletableFuture<Long> siteCountDeltaFuture = CompletableFuture.supplyAsync(
			() -> siteRepository.countSitesByDate(startDate, endDate));
		CompletableFuture<Long> noneSiteCountDeltaFuture = CompletableFuture.supplyAsync(
			() -> siteRepository.countSitesByStatusAndDate(PwaStatus.NONE, startDate, endDate));
		CompletableFuture<Long> pwaCountDeltaFuture = CompletableFuture.supplyAsync(
			() -> siteRepository.countSitesByStatusAndDate(PwaStatus.CONFIRM, startDate, endDate));
		CompletableFuture<Long> noPwaCountDeltaFuture = CompletableFuture.supplyAsync(
			() -> siteRepository.countSitesByStatusAndDate(PwaStatus.NO_PWA, startDate, endDate));
		CompletableFuture<Long> totalDownloadCountDeltaFuture = CompletableFuture.supplyAsync(
			() -> userPwaRepository.getDownloadCountByDateV2(startDate, endDate));
		CompletableFuture<Long> blockedPwaCountDeltaFuture = CompletableFuture.supplyAsync(
			() -> pwaRepository.countBlockedPwaByDate(startDate, endDate));

		// 모든 병렬 작업 완료 대기
		// 모든 병렬 작업 완료 대기
		CompletableFuture.allOf(
			siteCountDeltaFuture, noneSiteCountDeltaFuture, pwaCountDeltaFuture, noPwaCountDeltaFuture,
			totalDownloadCountDeltaFuture,
			blockedPwaCountDeltaFuture,
			siteCountDeltaFuture, noneSiteCountDeltaFuture, pwaCountDeltaFuture, noPwaCountDeltaFuture,
			totalDownloadCountDeltaFuture, blockedPwaCountDeltaFuture
		).join();

		// 결과 가져오기
		Long siteCount = siteCountFuture.join();
		Long noneSiteCount = noneSiteCountFuture.join();
		Long pwaCount = pwaCountFuture.join();
		Long noPwaCount = noPwaCountFuture.join();
		Long totalDownloadCount = totalDownloadCountFuture.join();
		Long blockedPwaCount = blockedPwaCountFuture.join();

		Long siteCountDelta = siteCountDeltaFuture.join();
		Long noneSiteCountDelta = noneSiteCountDeltaFuture.join();
		Long pwaCountDelta = pwaCountDeltaFuture.join();
		Long noPwaCountDelta = noPwaCountDeltaFuture.join();
		Long totalDownloadCountDelta = totalDownloadCountDeltaFuture.join();
		Long blockedPwaCountDelta = blockedPwaCountDeltaFuture.join();

		return PwaTotalStatsGetResponse.builder()
			.siteCount(siteCount)
			.siteCountDelta(siteCountDelta)
			.noneSiteCount(noneSiteCount)
			.noneSiteCountDelta(noneSiteCountDelta)
			.pwaCount(pwaCount)
			.pwaCountDelta(pwaCountDelta)
			.noPwaCount(noPwaCount)
			.noPwaCountDelta(noPwaCountDelta)
			.totalDownloadCount(totalDownloadCount)
			.totalDownloadCountDelta(totalDownloadCountDelta)
			.blockedPwaCount(blockedPwaCount)
			.blockedPwaCountDelta(blockedPwaCountDelta)
			.build();
	}

	public List<PwaCategoryCountGetResponse> getCategoryCounts(Integer userId) {

		User user = userRepository.findById(userId).orElseThrow();
		Language userLanguage = user.getLanguage();

		Boolean isLanguage = pwaCategoryRepository.existsCategoryContentsByLanguage(userLanguage);
		if (!isLanguage) {
			userLanguage = languageRepository.findById(BASE_LANGUAGE_ID).orElseThrow();
		}

		List<Object[]> results = pwaCategoryRepository.countCategoriesByUserLanguage(userLanguage);

		return results.stream()
			.map(row -> PwaCategoryCountGetResponse.builder()
				.id((Integer)row[0])
				.name((String)row[1])
				.count((Long)row[2])
				.build()
			)
			.collect(Collectors.toList());
	}

	public List<PwaDailyStatsGetResponse> getDailyStatsFor(Integer day) {
		List<PwaDailyStatsGetResponse> dailyStats = new ArrayList<>();
		LocalDateTime today = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);

		// 오늘부터 최근 N일 동안의 데이터를 조회
		for (int i = 0; i < day; i++) {
			LocalDateTime startOfDay = today.minusDays(i);
			LocalDateTime endOfDay = today.minusDays(i).plusDays(1);

			Long noneSiteCount = siteRepository.countSitesByStatusAndDate(PwaStatus.NONE, startOfDay, endOfDay);
			Long pwaCount = siteRepository.countSitesByStatusAndDate(PwaStatus.CONFIRM, startOfDay, endOfDay);
			Long noPwaCount = siteRepository.countSitesByStatusAndDate(PwaStatus.NO_PWA, startOfDay, endOfDay);
			Long totalDownloadCount = userPwaRepository.getDownloadCountByDateV2(startOfDay, endOfDay);
			Long blockedPwaCount = pwaRepository.countBlockedPwaByDate(startOfDay, endOfDay);

			dailyStats.add(PwaDailyStatsGetResponse.builder()
				.date(startOfDay.toLocalDate())
				.noneSiteCount(noneSiteCount)
				.pwaCount(pwaCount)
				.noPwaCount(noPwaCount)
				.totalDownloadCount(totalDownloadCount)
				.blockedPwaCount(blockedPwaCount)
				.build());
		}

		return dailyStats;
	}

	public List<PwaStackStatsGetResponse> getStackStatsFor(Integer day) {
		List<PwaStackStatsGetResponse> stackStats = new ArrayList<>();
		LocalDateTime now = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);

		// 최초 집계 시작 날짜
		LocalDateTime initialDate = LocalDateTime.of(2025, 1, 1, 0, 0);

		// 1. [초기 누적값 설정] 2025-01-01 ~ (now - (day-1))까지 미리 누적
		LocalDateTime endDate = now.minusDays(day - 1); // 누적 종료일
		Long cumulativeNoneSiteCount = siteRepository.countSitesByStatusAndDate(PwaStatus.NONE, initialDate, endDate);
		Long cumulativePwaCount = siteRepository.countSitesByStatusAndDate(PwaStatus.CONFIRM, initialDate, endDate);
		Long cumulativeNoPwaCount = siteRepository.countSitesByStatusAndDate(PwaStatus.NO_PWA, initialDate, endDate);
		Long cumulativeTotalDownloadCount = userPwaRepository.getDownloadCountByDateV2(initialDate, endDate);
		Long cumulativeBlockedPwaCount = pwaRepository.countBlockedPwaByDate(initialDate, endDate);

		// 2. [최근 day일 데이터를 추가] 오늘 날짜부터 과거로 이동하며 누적 진행
		for (int i = day - 1; i >= 0; i--) {
			LocalDateTime startOfDay = now.minusDays(i);
			LocalDateTime endOfDay = now.minusDays(i - 1);

			Long noneSiteCount = siteRepository.countSitesByStatusAndDate(PwaStatus.NONE, startOfDay, endOfDay);
			Long pwaCount = siteRepository.countSitesByStatusAndDate(PwaStatus.CONFIRM, startOfDay, endOfDay);
			Long noPwaCount = siteRepository.countSitesByStatusAndDate(PwaStatus.NO_PWA, startOfDay, endOfDay);
			Long totalDownloadCount = userPwaRepository.getDownloadCountByDateV2(startOfDay, endOfDay);
			Long blockedPwaCount = pwaRepository.countBlockedPwaByDate(startOfDay, endOfDay);

			// 기존 누적값에 추가
			cumulativeNoneSiteCount += noneSiteCount;
			cumulativePwaCount += pwaCount;
			cumulativeNoPwaCount += noPwaCount;
			cumulativeTotalDownloadCount += totalDownloadCount;
			cumulativeBlockedPwaCount += blockedPwaCount;

			// 리스트에 추가
			stackStats.add(PwaStackStatsGetResponse.builder()
				.date(startOfDay.toLocalDate())
				.noneSiteStackCount(cumulativeNoneSiteCount)
				.pwaStackCount(cumulativePwaCount)
				.noPwaStackCount(cumulativeNoPwaCount)
				.totalDownloadStackCount(cumulativeTotalDownloadCount)
				.blockedPwaStackCount(cumulativeBlockedPwaCount)
				.build());
		}

		return stackStats;
	}

	public Page<PwaAdminSearchGetResponse> searchAdminPwas(Integer userId, PwaAdminSearchGetRequest request) {
		Page<Pwa> pwaPage = pwaRepository.searchPwas(request, request.getIsBlocked(), request.getAcceptanceStatus());
		User user = userRepository.findById(userId).orElseThrow();

		return pwaPage.map(pwa -> {

			// 사용자의 언어에 맞는 content 찾기
			Content content = pwa.getContents().stream()
				.filter(c -> c.getLanguage().equals(user.getLanguage()))
				.findFirst()
				.orElse(pwa.getContents().stream()
					.filter(c -> c.getLanguage().getId() == BASE_LANGUAGE_ID)
					.findFirst()
					.orElseGet(() -> Content.builder().build()));

			return PwaAdminSearchGetResponse.builder()
				.id(pwa.getId())
				.iconImage(pwa.getIconImage())
				.name(content.getName())
				.downloadCount(pwa.getDownloadCount())
				.websiteUrl(pwa.getWebsiteUrl())
				.acceptanceStatus(pwa.getAcceptanceStatus())
				.appId(pwa.getAppId())
				.blockedAt(pwa.getBlockedAt())
				.createdAt(pwa.getCreatedAt())
				.updatedAt(pwa.getUpdatedAt())
				.categories(pwa.getPwaCategories().stream()
					.map(category -> {

						// 사용자의 언어에 맞는 category content 찾기
						CategoryContent categoryContent = category.getCategory().getCategoryContents().stream()
							.filter(cc -> cc.getLanguage().equals(user.getLanguage()))
							.findFirst()
							.orElse(category.getCategory().getCategoryContents().stream()
								.filter(cc -> cc.getLanguage().getId() == BASE_LANGUAGE_ID)
								.findFirst()
								.orElseThrow(() -> new RuntimeException("지원하지 않는 언어")));

						return PwaAdminSearchGetResponse.CategoryDto.builder()
							.name(categoryContent.getName())
							.categoryOrder(category.getCategory().getCategoryOrder())
							.build();
					})
					.collect(Collectors.toList()))

				.files(pwa.getFiles().stream()
					.map(f -> PwaAdminSearchGetResponse.FileDto.builder()
						.downloadUrl(f.getDownloadUrl())
						.fileSize(f.getFileSize())
						.fileType(f.getFileType())
						.build())
					.collect(Collectors.toList()))
				.build();
		});
	}

	public PwaAdminDetailGetResponse getAdminPwaById(Integer userId, Integer pwaId, PwaAdminDetailGetRequest request) {

		Pwa pwa = pwaRepository.findByIdWithDetails(pwaId, request.getIsBlocked(), request.getAcceptanceStatus())
			.orElseThrow();
		User user = userRepository.findById(userId).orElseThrow();

		return PwaAdminDetailGetResponse.builder()
			.id(pwa.getId())
			.iconImage(pwa.getIconImage())
			.websiteUrl(pwa.getWebsiteUrl())
			.avgScore(pwa.getAvgScore())
			.downloadCount(pwa.getDownloadCount())
			.version(pwa.getVersion())
			.company(pwa.getCompany())
			.developerSite(pwa.getDeveloperSite())
			.createdAt(pwa.getCreatedAt())
			.updatedAt(pwa.getUpdatedAt())
			.blockedAt(pwa.getBlockedAt())
			.acceptanceStatus(pwa.getAcceptanceStatus())
			.ageLimit(pwa.getAgeLimit().getName())
			.appId(pwa.getAppId())

			.contents(pwa.getContents().stream()
				.map(c -> PwaAdminDetailGetResponse.ContentDto.builder()
					.name(c.getName())
					.summary(c.getSummary())
					.description(c.getDescription())
					.languageId(c.getLanguage().getId())
					.languageCode(c.getLanguage().getCode())
					.languageName(c.getLanguage().getName())
					.build())
				.collect(Collectors.toList()))

			.display(pwa.getDisplay() != null ?
				PwaAdminDetailGetResponse.DisplayDto.builder()
					.isLarge(pwa.getDisplay().getIsLarge())
					.isMedium(pwa.getDisplay().getIsMedium())
					.isMediumSmall(pwa.getDisplay().getIsMediumSmall())
					.isSmall(pwa.getDisplay().getIsSmall())
					.imageUrlLarge(pwa.getDisplay().getImageUrlLarge())
					.imageUrlMedium(pwa.getDisplay().getImageUrlMedium())
					.imageUrlSmall(pwa.getDisplay().getImageUrlSmall())
					.build()
				: null)

			.screenshots(pwa.getScreenshots().stream()
				.map(screenshot -> PwaAdminDetailGetResponse.ScreenshotDto.builder()
					.imageUrl(screenshot.getImageUrl())
					.screenshotOrder(screenshot.getScreenshotOrder())
					.build())
				.collect(Collectors.toList()))

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

					return PwaAdminDetailGetResponse.CategoryDto.builder()
						.name(categoryContent.getName())
						.categoryOrder(pc.getCategory().getCategoryOrder())
						.build();
				})
				.collect(Collectors.toList()))

			.hashtags(pwa.getPwaHashtags().stream()
				.map(ph -> PwaAdminDetailGetResponse.HashtagDto.builder()
					.name(ph.getHashtag().getName())
					.build())
				.collect(Collectors.toList()))

			.languages(pwa.getPwaLanguages().stream()
				.map(pl -> PwaAdminDetailGetResponse.LanguageDto.builder()
					.name(pl.getLanguage().getName())
					.code(pl.getLanguage().getCode())
					.build())
				.collect(Collectors.toList()))

			.permissions(pwa.getPwaPermissions().stream()
				.map(pp -> PwaAdminDetailGetResponse.PermissionDto.builder()
					.name(pp.getPermission().getName())
					.isRequired(pp.getIsRequired())
					.build())
				.collect(Collectors.toList()))

			.files(pwa.getFiles().stream()
				.map(f -> PwaAdminDetailGetResponse.FileDto.builder()
					.downloadUrl(f.getDownloadUrl())
					.fileSize(f.getFileSize())
					.fileType(f.getFileType())
					.build())
				.collect(Collectors.toList()))
			.build();
	}

	public List<PwaCategoryGetResponse> getCategories(Integer userId) {

		User user = userRepository.findById(userId).orElseThrow();

		return categoryRepository.findAll().stream()
			.map(c -> {

				// 사용자의 언어에 맞는 category content 찾기
				CategoryContent categoryContent = c.getCategoryContents().stream()
					.filter(cc -> cc.getLanguage().equals(user.getLanguage()))
					.findFirst()
					.orElse(c.getCategoryContents().stream()
						.filter(cc -> cc.getLanguage().getId() == BASE_LANGUAGE_ID)
						.findFirst()
						.orElseThrow(() -> new RuntimeException("지원하지 않는 언어")));

				return PwaCategoryGetResponse.builder()
					.id(c.getId())
					.name(categoryContent.getName())
					.categoryOrder(c.getCategoryOrder())
					.categoryImage(c.getCategoryImage())
					.build();
			})
			.collect(Collectors.toList());
	}

	public List<PwaCategoryGetResponse> getCategoriesByLanguageCode(Integer userId, String languageCode) {
		// 1. 유저 찾기
		User user = userRepository.findById(userId).orElseThrow();

		// 2. 언어 코드로 Language 엔티티 찾기
		Language language = languageRepository.findByCode(languageCode)
				.orElseThrow(() -> new RuntimeException("지원하지 않는 언어 코드: " + languageCode));

		// 3. 해당 언어에 맞는 카테고리 찾기
		List<Category> categories = categoryRepository.findCategoriesByLanguage(language);

		return categories.stream()
				.map(c -> {
					// 사용자의 언어에 맞는 category content 찾기
					CategoryContent categoryContent = c.getCategoryContents().stream()
							.filter(cc -> cc.getLanguage().getCode().equals(languageCode))
							.findFirst()
							.orElse(c.getCategoryContents().stream()
									.filter(cc -> cc.getLanguage().getId() == BASE_LANGUAGE_ID)
									.findFirst()
									.orElseThrow(() -> new RuntimeException("지원하지 않는 언어")));

					return PwaCategoryGetResponse.builder()
							.id(c.getId())
							.name(categoryContent.getName())
							.categoryOrder(c.getCategoryOrder())
							.categoryImage(c.getCategoryImage())
							.build();
				})
				.collect(Collectors.toList());
	}

	public void blockPwa(Integer pwaId) {
		Pwa pwa = pwaRepository.findById(pwaId).orElseThrow();
		pwa.setBlockedAt(LocalDateTime.now());
	}

	public void unblockPwa(Integer pwaId) {
		Pwa pwa = pwaRepository.findById(pwaId).orElseThrow();
		pwa.setBlockedAt(null);
	}

	public void updateAcceptance(Integer pwaId, PwaAcceptancePostRequest request) {
		Pwa pwa = pwaRepository.findById(pwaId).orElseThrow();
		AcceptanceStatus acceptanceStatus = request.getAcceptanceStatus();

		pwa.setAcceptanceStatus(acceptanceStatus);

		if (acceptanceStatus == AcceptanceStatus.ACCEPTED) {
			pwa.setAcceptedAt(LocalDateTime.now());
		}

		if (acceptanceStatus == AcceptanceStatus.REJECTED || acceptanceStatus == AcceptanceStatus.NONE) {
			pwa.setAcceptedAt(null);
		}
	}

	public void updatePwa(Integer pwaId, PwaPatchRequest request) {
		Pwa pwa = pwaRepository.findById(pwaId).orElseThrow();

		Optional.ofNullable(request.getIconImage()).ifPresent(pwa::setIconImage);
		Optional.ofNullable(request.getWebsiteUrl()).ifPresent(pwa::setWebsiteUrl);
		Optional.ofNullable(request.getVersion()).ifPresent(pwa::setVersion);
		Optional.ofNullable(request.getCompany()).ifPresent(pwa::setCompany);
		Optional.ofNullable(request.getDeveloperSite()).ifPresent(pwa::setDeveloperSite);
		Optional.ofNullable(request.getAcceptanceStatus()).ifPresent(pwa::setAcceptanceStatus);

	}

	public void updatePwaContent(Integer pwaId, Integer languageId, PwaContentPatchRequest request) {
		Content content = contentRepository.findByPwaIdAndLanguageId(pwaId, languageId).orElseThrow();

		Optional.ofNullable(request.getName()).ifPresent(content::setName);
		Optional.ofNullable(request.getSummary()).ifPresent(content::setSummary);
		Optional.ofNullable(request.getDescription()).ifPresent(content::setDescription);
	}

	public void updatePwaScreenshot(Integer pwaId, PwaScreenshotPutRequest request, List<MultipartFile> images) {
		Pwa pwa = pwaRepository.findById(pwaId).orElseThrow();
		Content content = contentRepository.findByPwaIdAndLanguageId(pwaId, 1).orElseThrow();

		// screenshot 저장
		List<Screenshot> screenshots = new ArrayList<>();

		for (int i = 0; i < images.size(); i++) {
			MultipartFile image = images.get(i);
			Integer order = request.getScreenshotOrders().get(i);

			// 파일 저장 (예: S3 또는 로컬 저장소)
			String imageUrl = fileService.uploadFile(image, content.getName());

			// Screenshot 객체 생성
			Screenshot screenshot = Screenshot.builder()
				.pwa(pwa)
				.screenshotOrder(order)
				.imageUrl(imageUrl)
				.build();

			screenshots.add(screenshot);
		}

		// 기존 pwa 이미지 제거
		for (Screenshot screenshot : pwa.getScreenshots()) {
			fileService.deleteFile(screenshot.getImageUrl());
			pwa.removeScreenshot(screenshot);
		}

		// pwa 에 screenshot 추가
		for (Screenshot screenshot : screenshots) {
			pwa.addScreenshot(screenshot);
		}
	}
}
