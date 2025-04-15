package com.ssafy.pwandora.global.dto;

import java.util.List;

import org.springframework.data.domain.Page;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommonPageResponse<T> {

	private List<T> content;

	private Integer page;

	private Integer size;

	private Boolean isLast;

	private Long total;

	private Integer totalPageCount;

	public static <T> CommonPageResponse<T> from(Page<T> pageData) {
		return CommonPageResponse.<T>builder()
			.content(pageData.getContent())
			.page(pageData.getNumber())
			.size(pageData.getSize())
			.isLast(pageData.isLast())
			.total(pageData.getTotalElements())
			.totalPageCount(pageData.getTotalPages())
			.build();
	}
}