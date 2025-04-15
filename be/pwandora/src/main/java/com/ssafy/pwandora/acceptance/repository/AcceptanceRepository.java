package com.ssafy.pwandora.acceptance.repository;

import com.ssafy.pwandora.acceptance.entity.AcceptanceChecklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/* PWA 검수 체크리스트 데이터 접근을 위한 Repository */
@Repository
public interface AcceptanceRepository extends JpaRepository<AcceptanceChecklist, Integer> {

    /**
     * PWA ID로 검수 체크리스트를 조회합니다.
     *
     * @param pwaId PWA ID
     * @return 검수 체크리스트 정보
     */
    Optional<AcceptanceChecklist> findByPwaId(Integer pwaId);
}