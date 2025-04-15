package com.ssafy.pwandora.acceptance.repository;

import com.ssafy.pwandora.acceptance.entity.ContentModeration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContentModerationRepository extends JpaRepository<ContentModeration, Integer> {
    Optional<ContentModeration> findByPwaId(Integer pwaId);
}