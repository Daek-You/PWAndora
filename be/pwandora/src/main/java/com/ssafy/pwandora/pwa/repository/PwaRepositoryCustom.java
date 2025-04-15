package com.ssafy.pwandora.pwa.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;

import com.ssafy.pwandora.pwa.dto.request.PwaSearchGetRequest;
import com.ssafy.pwandora.pwa.entity.AcceptanceStatus;
import com.ssafy.pwandora.pwa.entity.Pwa;

public interface PwaRepositoryCustom {
	Page<Pwa> searchPwas(PwaSearchGetRequest request,
		Boolean isBlocked,
		AcceptanceStatus acceptanceStatus);

	Optional<Pwa> findByIdWithDetails(Integer id,
		Boolean isBlocked,
		AcceptanceStatus acceptanceStatus);
}
