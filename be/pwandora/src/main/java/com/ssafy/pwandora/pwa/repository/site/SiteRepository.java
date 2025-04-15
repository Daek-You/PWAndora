package com.ssafy.pwandora.pwa.repository.site;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.pwandora.pwa.entity.site.PwaStatus;
import com.ssafy.pwandora.pwa.entity.site.Site;

@Repository
public interface SiteRepository extends JpaRepository<Site, Integer> {

	Long countByStatus(PwaStatus status);

	@Query("SELECT COUNT(s) FROM Site s WHERE s.updatedAt >= :from AND s.updatedAt < :to")
	Long countSitesByDate(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

	@Query("SELECT COUNT(s) FROM Site s WHERE s.status = :status AND s.updatedAt >= :from AND s.updatedAt < :to")
	Long countSitesByStatusAndDate(@Param("status") PwaStatus status, @Param("from") LocalDateTime from,
		@Param("to") LocalDateTime to);
}
