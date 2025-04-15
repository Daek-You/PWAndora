package com.ssafy.pwandora.pwa.repository;

import static com.ssafy.pwandora.language.entity.QLanguage.*;
import static com.ssafy.pwandora.pwa.entity.QPwa.*;
import static com.ssafy.pwandora.pwa.entity.category.QCategory.*;
import static com.ssafy.pwandora.pwa.entity.category.QPwaCategory.*;
import static com.ssafy.pwandora.pwa.entity.display.QDisplay.*;
import static com.ssafy.pwandora.pwa.entity.hashtag.QPwaHashtag.*;
import static com.ssafy.pwandora.pwa.entity.language.QPwaLanguage.*;
import static com.ssafy.pwandora.pwa.entity.permission.QPermission.*;
import static com.ssafy.pwandora.pwa.entity.permission.QPwaPermission.*;
import static com.ssafy.pwandora.pwa.entity.screenshot.QScreenshot.*;
import static com.ssafy.pwandora.pwa.entity.site.QSite.*;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.pwandora.pwa.dto.request.PwaSearchGetRequest;
import com.ssafy.pwandora.pwa.entity.AcceptanceStatus;
import com.ssafy.pwandora.pwa.entity.Pwa;
import com.ssafy.pwandora.pwa.entity.site.PwaStatus;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PwaRepositoryImpl implements PwaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public Page<Pwa> searchPwas(PwaSearchGetRequest request,
		Boolean isBlocked,
		AcceptanceStatus acceptanceStatus) {
		BooleanBuilder builder = new BooleanBuilder();

		if (request.getName() != null) {
			builder.and(pwa.contents.any().name.containsIgnoreCase(request.getName()));
		}
		if (request.getCategory() != null) {
			builder.and(pwa.pwaCategories.any().category.categoryContents.any().name.eq(request.getCategory()));
		}
		if (request.getHashtag() != null) {
			builder.and(pwa.pwaHashtags.any().hashtag.name.eq(request.getHashtag()));
		}
		if (request.getLanguage() != null) {
			builder.and(pwa.pwaLanguages.any().language.name.eq(request.getLanguage()));
		}
		if (request.getFileType() != null) {
			builder.and(pwa.files.any().fileType.eq(request.getFileType()));
		}

		// 차단되지 않은 앱만 가져오기
		// 차단 여부 필터 추가
		if (isBlocked != null) {
			if (!isBlocked) {
				// isBlocked 가 false -> blockedAt 이 null 인 경우만 가져오기
				builder.and(pwa.blockedAt.isNull());
			} else {
				// isBlocked 가 true -> blockedAt 이 null 이 아닌 경우만 가져오기
				builder.and(pwa.blockedAt.isNotNull());
			}
		}

		// 검수 확인 결과 반영
		if (acceptanceStatus != null) {
			builder.and(pwa.acceptanceStatus.eq(acceptanceStatus));
		}

		// PwaStatus 가 CONFIRM 인 것만 가져오기
		builder.and(pwa.site.status.eq(PwaStatus.CONFIRM));

		List<Pwa> results = queryFactory
			.selectFrom(pwa)
			.leftJoin(pwa.display, display).fetchJoin()  // OneToOne Display 한 번에 조회
			.leftJoin(pwa.site, site).fetchJoin()        // OneToOne Site 한 번에 조회
			.where(builder)
			.orderBy(getOrderSpecifier(request.getSortCriteria(), request.getSortDirection())) // 동적 정렬 적용
			.offset(request.toPageable().getOffset())
			.limit(request.toPageable().getPageSize())
			.fetch();

		Long total = queryFactory
			.select(pwa.id.count())
			.from(pwa)
			.where(builder)
			.fetchOne();

		return new PageImpl<>(results, request.toPageable(), total);
	}

	private OrderSpecifier<?> getOrderSpecifier(String sortCriteria, Sort.Direction sortDirection) {
		PathBuilder<Pwa> entityPath = new PathBuilder<>(Pwa.class, "pwa");

		if (sortDirection == Sort.Direction.DESC) {
			return entityPath.getString(sortCriteria).desc();
		} else {
			return entityPath.getString(sortCriteria).asc();
		}
	}

	@Override
	public Optional<Pwa> findByIdWithDetails(Integer id,
		Boolean isBlocked,
		AcceptanceStatus acceptanceStatus) {

		BooleanBuilder builder = new BooleanBuilder();

		// id로 필터링
		builder.and(pwa.id.eq(id));

		// isBlocked 값에 따른 필터링
		if (isBlocked != null) {
			if (!isBlocked) {
				builder.and(pwa.blockedAt.isNull());  // isBlocked가 false일 경우 blockedAt이 null이어야 함
			} else {
				builder.and(pwa.blockedAt.isNotNull());  // isBlocked가 true일 경우 blockedAt이 null이 아님
			}
		}

		// acceptanceStatus 값에 따른 필터링
		if (acceptanceStatus != null) {
			builder.and(pwa.acceptanceStatus.eq(acceptanceStatus));
		}

		Pwa result = queryFactory
			.selectFrom(pwa)
			.distinct()
			.leftJoin(pwa.display, display).fetchJoin()
			.leftJoin(pwa.screenshots, screenshot).fetchJoin()
			.leftJoin(pwa.pwaCategories, pwaCategory)
			.leftJoin(pwaCategory.category, category)
			.leftJoin(pwa.pwaHashtags, pwaHashtag)
			.leftJoin(pwa.pwaLanguages, pwaLanguage)
			.leftJoin(pwaLanguage.language, language)
			.leftJoin(pwa.pwaPermissions, pwaPermission)
			.leftJoin(pwaPermission.permission, permission)
			.where(builder)  // BooleanBuilder로 필터링
			.fetchOne();  // 단일 결과 반환

		return Optional.ofNullable(result);
	}
}