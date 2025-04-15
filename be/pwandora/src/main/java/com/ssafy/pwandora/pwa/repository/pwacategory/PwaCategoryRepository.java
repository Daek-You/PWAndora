package com.ssafy.pwandora.pwa.repository.pwacategory;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.pwandora.language.entity.Language;
import com.ssafy.pwandora.pwa.entity.category.PwaCategory;

@Repository
public interface PwaCategoryRepository extends JpaRepository<PwaCategory, Integer> {

	@Query("SELECT c.id, cc.name, COUNT(pc) " +
		"FROM PwaCategory pc " +
		"JOIN pc.category c " +
		"JOIN c.categoryContents cc " +
		"JOIN cc.language l " +
		"WHERE l = :language " +
		"GROUP BY c.id, cc.name")
	List<Object[]> countCategoriesByUserLanguage(@Param("language") Language language);

	@Query("SELECT COUNT(cc) > 0 FROM CategoryContent cc WHERE cc.language = :language")
	Boolean existsCategoryContentsByLanguage(@Param("language") Language language);

	void deleteByPwaId(Integer pwaId);

	List<PwaCategory> findByPwaId(Integer pwaId);
}


