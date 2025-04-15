package com.ssafy.pwandora.global.dto;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Setter
@Getter
public class CommonPageRequest {

	@Schema(description = "페이지 번호 (0부터 시작)", example = "0")
	private Integer page = 0;

	@Schema(description = "페이지 크기", example = "20")
	private Integer size = 20;

	@Schema(description = "정렬 기준 필드", example = "createdAt")
	private String sortCriteria = "createdAt";

	@Schema(description = "정렬 방향", example = "DESC")
	private Direction sortDirection = Direction.DESC;

	public CommonPageRequest(Integer page, Integer size, String sortCriteria, Direction sortDirection) {
		this.page = page;
		this.size = size;
		this.sortCriteria = sortCriteria;
		this.sortDirection = sortDirection;
	}

	public CommonPageRequest(Integer page, Integer size) {
		this.page = page;
		this.size = size;
	}

	public Pageable toPageable() {
		return PageRequest.of(this.page, this.size, sortDirection, sortCriteria);
	}

	public Pageable toPageableWithSort(Sort sort) {
		return PageRequest.of(this.page, this.size, sort);
	}

	public Pageable toPageableWithCriteria(String sortCriteria) {
		return PageRequest.of(this.page, this.size, this.sortDirection, sortCriteria);
	}
}
