package com.ssafy.pwandora.pwa.repository.pwacategory;

import java.util.List;

import com.ssafy.pwandora.acceptance.dto.CategoryDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.pwandora.language.entity.Language;
import com.ssafy.pwandora.pwa.entity.category.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

	@Query("SELECT c FROM Category c " +
		"JOIN c.categoryContents cc " +
		"JOIN cc.language l " +
		"WHERE l = :language")
	List<Category> findCategoriesByLanguage(@Param("language") Language language);

	@Query("SELECT new com.ssafy.pwandora.acceptance.dto.CategoryDto(c.id, cc.name) FROM Category c " +
			"JOIN CategoryContent cc ON c.id = cc.category.id " +
			"JOIN PwaCategory pc ON pc.category.id = c.id " +
			"WHERE pc.pwa.id = :pwaId AND cc.language.id = :languageId")
	List<CategoryDto> findCategoriesByPwaId(@Param("pwaId") Integer pwaId, @Param("languageId") Integer languageId);
}
