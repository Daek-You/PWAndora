package com.ssafy.pwandora.pwa.repository.content;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.pwandora.pwa.entity.Content;

@Repository
public interface ContentRepository extends JpaRepository<Content, Integer> {
	Optional<Content> findByPwaIdAndLanguageId(Integer pwaId, Integer languageId);

	@Query("SELECT c FROM Content c JOIN c.language l WHERE c.pwa.id = :pwaId AND l.code = :languageCode")
	Optional<Content> findByPwaIdAndLanguageCode(@Param("pwaId") Integer pwaId, @Param("languageCode") String languageCode);

	List<Content> findByPwaId(Integer pwaId);
}