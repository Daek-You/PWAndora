package com.ssafy.pwandora.pwa.entity.language;

import com.ssafy.pwandora.language.entity.Language;
import com.ssafy.pwandora.pwa.entity.Pwa;

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
public class PwaLanguage {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pwa_id", nullable = false)
	private Pwa pwa;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "language_id", nullable = false)
	private Language language;

	public static PwaLanguage create(Pwa pwa, Language language) {
		PwaLanguage pwaLanguage = new PwaLanguage();
		pwaLanguage.setPwa(pwa);
		pwaLanguage.setLanguage(language);
		return pwaLanguage;
	}
}
