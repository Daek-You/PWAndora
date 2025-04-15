package com.ssafy.pwandora.event.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.pwandora.event.dto.response.EventGetResponse;
import com.ssafy.pwandora.event.entity.EventContent;
import com.ssafy.pwandora.event.repository.EventRepository;
import com.ssafy.pwandora.pwa.entity.Content;
import com.ssafy.pwandora.pwa.entity.Pwa;
import com.ssafy.pwandora.pwa.repository.PwaRepository;
import com.ssafy.pwandora.user.entity.User;
import com.ssafy.pwandora.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Transactional
@Service
public class EventService {

	private final EventRepository eventRepository;
	private final UserRepository userRepository;
	private final PwaRepository pwaRepository;

	private static final int BASE_LANGUAGE_ID = 1;

	public List<EventGetResponse> getEvents(Integer userId) {

		User user = userRepository.findById(userId).orElseThrow();

		return eventRepository.findTop5ByOrderByCreatedAtDesc().stream()
			.map(event -> {
					EventContent eventContent = event.getContents().stream()
						.filter(e -> e.getLanguage().equals(user.getLanguage()))
						.findFirst()
						.orElseGet(() -> event.getContents().stream()
							.filter(c -> c.getLanguage().getId() == BASE_LANGUAGE_ID)
							.findFirst()
							.orElseThrow());

					Pwa pwa = pwaRepository.findById(event.getPwa().getId()).orElseThrow();
					// 사용자의 언어에 맞는 content 찾기
					Content pwaContent = pwa.getContents().stream()
						.filter(c -> c.getLanguage().equals(user.getLanguage()))
						.findFirst()
						.orElse(pwa.getContents().stream()
							.filter(c -> c.getLanguage().getId() == BASE_LANGUAGE_ID)
							.findFirst()
							.orElseGet(() -> Content.builder().build()));

					return EventGetResponse.builder()
						.color(event.getColor())
						.title(eventContent.getTitle())
						.description(eventContent.getDescription())
						.startAt(event.getStartAt())
						.endAt(event.getEndAt())
						.pwaId(pwa.getId())
						.iconUrl(pwa.getIconImage())
						.name(pwaContent.getName())
						.build();
				}
			).collect(Collectors.toList());
	}
}
