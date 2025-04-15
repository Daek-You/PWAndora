package com.ssafy.pwandora.user.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.ssafy.pwandora.language.entity.Language;
import com.ssafy.pwandora.pwa.entity.Pwa;
import com.ssafy.pwandora.pwa.entity.file.FileType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Getter
@Setter
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(nullable = false)
	private String loginId;

	@Column(nullable = false)
	private String password;

	private String email;

	@ColumnDefault("'USER'")
	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private Role role;

	private LocalDateTime deletedAt;

	@CreatedDate
	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@LastModifiedDate
	private LocalDateTime updatedAt;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<UserPwa> userPwas = new ArrayList<>();

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "language_id", nullable = false)
	private Language language;

	public void updateApp(Pwa pwa, FileType fileType) {
		userPwas.stream()
			.filter(up -> up.getPwa().getId().equals(pwa.getId()))
			.filter(up -> up.getFileType().equals(fileType))
			.findFirst()
			.ifPresentOrElse(
				up -> {
					if (up.getDeletedAt() != null) {
						up.setDeletedAt(null);
					}
					up.incrementDownloadCount();
					up.setUpdateAt(LocalDateTime.now());
				},
				() -> addPwa(pwa, fileType)
			);
	}

	public void deleteApp(Pwa pwa, FileType fileType) {
		UserPwa userPwa = userPwas.stream()
			.filter(up -> up.getPwa().getId().equals(pwa.getId()))
			.filter(up -> up.getFileType().equals(fileType))
			.findFirst()
			.orElseThrow();

		userPwa.setDeletedAt(LocalDateTime.now());
	}

	// 연관관계 편의 메서드
	public void addPwa(Pwa pwa, FileType fileType) {
		UserPwa userPwa = UserPwa.create(this, pwa, fileType);
		userPwas.add(userPwa);
	}

	public void removePwa(Pwa pwa) {
		userPwas.removeIf(up -> up.getPwa().equals(pwa));
	}
}
