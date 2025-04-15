package com.ssafy.pwandora.pwa.entity.display;

import org.hibernate.annotations.ColumnDefault;

import com.ssafy.pwandora.pwa.entity.Pwa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Getter
@Setter
public class Display {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(nullable = false)
	@ColumnDefault("false")
	private Boolean isLarge;

	@Column(nullable = false)
	@ColumnDefault("false")
	private Boolean isMedium;

	@Column(nullable = false)
	@ColumnDefault("false")
	private Boolean isMediumSmall;

	@Column(nullable = false)
	@ColumnDefault("false")
	private Boolean isSmall;

	@Column(length = 1000)
	private String imageUrlLarge;

	@Column(length = 1000)
	private String imageUrlMedium;

	@Column(length = 1000)
	private String imageUrlSmall;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pwa_id")
	private Pwa pwa;
}
