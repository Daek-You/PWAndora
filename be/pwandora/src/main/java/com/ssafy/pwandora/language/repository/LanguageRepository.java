package com.ssafy.pwandora.language.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.pwandora.language.entity.Language;

public interface LanguageRepository extends JpaRepository<Language, Integer> {

	List<Language> findByDeletedAtIsNull();
	Optional<Language> findByCode(String languageCode);
}
