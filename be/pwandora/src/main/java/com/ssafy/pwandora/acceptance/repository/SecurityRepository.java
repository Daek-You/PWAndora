package com.ssafy.pwandora.acceptance.repository;

import com.ssafy.pwandora.acceptance.entity.Security;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SecurityRepository extends JpaRepository<Security, Integer> {
    Optional<Security> findByPwaId(Integer pwaId);
}
