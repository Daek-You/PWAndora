package com.ssafy.pwandora.pwa.entity;

import com.ssafy.pwandora.language.entity.Language;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
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
@Table(uniqueConstraints = {
	@UniqueConstraint(columnNames = {"pwa_id", "language_id"})
})
public class Content {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Builder.Default
	private String name = "No Information";

	@Builder.Default
	private String summary = "No Information";

	@Builder.Default
	@Column(length = 2000)
	private String description = "No Information";

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pwa_id")
	private Pwa pwa;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "language_id", nullable = false)
	private Language language;
}
