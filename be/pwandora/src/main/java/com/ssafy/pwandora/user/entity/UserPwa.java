package com.ssafy.pwandora.user.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.ssafy.pwandora.pwa.entity.Pwa;
import com.ssafy.pwandora.pwa.entity.file.FileType;

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
public class UserPwa {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "pwa_id", nullable = false)
	private Pwa pwa;

	@CreatedDate
	@Column(nullable = false, updatable = false)
	private LocalDateTime downloadAt;

	@ColumnDefault("0")
	private Integer downloadCount;

	@LastModifiedDate
	private LocalDateTime updateAt;

	private LocalDateTime deletedAt;

	@Enumerated(EnumType.STRING)
	private FileType fileType;

	public static UserPwa create(User user, Pwa pwa, FileType fileType) {
		return UserPwa.builder()
			.user(user)
			.pwa(pwa)
			.fileType(fileType)
			.downloadCount(1)
			.build();
	}

	public void incrementDownloadCount() {
		this.downloadCount++;
	}
}
