package com.ssafy.pwandora.pwa.entity;

import lombok.Getter;

@Getter
public enum AgeLimit {
	ALL("ALL", "모든 연령 사용 가능"),
	THREE_PLUS("3+", "어린이를 포함한 모든 연령층 이용 가능"),
	SEVEN_PLUS("7+", "약간의 공포 요소 또는 약한 만화적 폭력 포함 가능"),
	TWELVE_PLUS("12+", "가벼운 욕설, 약한 폭력, 암시적 주제 포함 가능"),
	SIXTEEN_PLUS("16+", "폭력적, 성적 콘텐츠가 포함될 수 있음"),
	EIGHTEEN_PLUS("18+", "강한 성적 콘텐츠, 도박 요소 포함 가능"),
	UNRATED("UNRATED", "등급이 없는 앱은 표시되지 않을 수 있음");

	private final String name;
	private final String description;

	AgeLimit(String name, String description) {
		this.name = name;
		this.description = description;
	}
}
