package com.ssafy.pwandora.language.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.pwandora.language.dto.response.LanguageGetResponse;
import com.ssafy.pwandora.language.repository.LanguageRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Transactional
@Service
public class LanguageService {

	private final LanguageRepository languageRepository;

	/**
	 * 언어 조회
	 */
	public List<LanguageGetResponse> getLanguages() {
		return languageRepository.findByDeletedAtIsNull().stream()
			.map(l -> LanguageGetResponse.builder()
				.id(l.getId())
				.name(l.getName())
				.code(l.getCode())
				.build()
			).toList();
	}
}
