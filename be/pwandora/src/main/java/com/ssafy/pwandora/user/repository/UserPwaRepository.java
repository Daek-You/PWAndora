package com.ssafy.pwandora.user.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.pwandora.user.entity.UserPwa;

public interface UserPwaRepository extends JpaRepository<UserPwa, Integer> {

	@Query("SELECT COUNT(up) FROM UserPwa up")
	Long getDownloadCount();

	// downloadAt 기준으로 특정 날짜 범위 내의 다운로드 횟수 조회
	@Query("SELECT COUNT(up) FROM UserPwa up WHERE up.downloadAt BETWEEN :startOfDay AND :endOfDay")
	Long getDownloadCountByDate(@Param("startOfDay") LocalDateTime startOfDay,
		@Param("endOfDay") LocalDateTime endOfDay);

	// downloadCount의 총합 반환
	@Query("SELECT SUM(up.downloadCount) FROM UserPwa up")
	Long getDownloadCountV2();

	// downloadAt 기준으로 특정 날짜 범위 내의 downloadCount 총합 조회
	@Query("SELECT COALESCE(SUM(up.downloadCount), 0) FROM UserPwa up WHERE up.downloadAt BETWEEN :startOfDay AND :endOfDay")
	Long getDownloadCountByDateV2(@Param("startOfDay") LocalDateTime startOfDay,
		@Param("endOfDay") LocalDateTime endOfDay);
}