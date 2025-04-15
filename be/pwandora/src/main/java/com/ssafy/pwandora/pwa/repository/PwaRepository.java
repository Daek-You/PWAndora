package com.ssafy.pwandora.pwa.repository;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.pwandora.acceptance.dto.response.AcceptanceUncensoredPwaGetResponse;
import com.ssafy.pwandora.pwa.entity.AcceptanceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.pwandora.pwa.entity.Pwa;
import com.ssafy.pwandora.pwa.entity.category.PwaCategory;

@Repository
public interface PwaRepository extends JpaRepository<Pwa, Integer>, PwaRepositoryCustom {

	// 각 PWA 앱에 대한 모든 카테고리 목록 조회
	@Query("SELECT pc FROM PwaCategory pc JOIN FETCH pc.category WHERE pc.pwa.id IN :pwaIds")
	List<PwaCategory> findCategoriesByPwaIds(@Param("pwaIds") List<Integer> pwaIds);

	// blockedAt이 NULL이 아닌 개수 조회
	Long countByBlockedAtIsNotNull();

	@Query("SELECT COUNT(p) FROM Pwa p WHERE p.blockedAt IS NOT NULL AND p.blockedAt >= :from AND p.blockedAt < :to")
	Long countBlockedPwaByDate(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

	@Query("SELECT new com.ssafy.pwandora.acceptance.dto.response.AcceptanceUncensoredPwaGetResponse(p.id, COALESCE(c.name, 'Unknown'), p.websiteUrl) " +
			"FROM Pwa p " +
			"JOIN AcceptanceChecklist ac ON p.id = ac.pwaId " +
			"LEFT JOIN Content c ON p.id = c.pwa.id AND c.language.id = :languageId " +
			"WHERE p.acceptanceStatus = :status AND p.blockedAt is NULL")
	Page<AcceptanceUncensoredPwaGetResponse> findUncensoredPwas(@Param("languageId") Integer languageId, @Param("status") AcceptanceStatus status, Pageable pageable);
}
