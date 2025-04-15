package com.ssafy.pwandora.pwa.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.ssafy.pwandora.language.entity.Language;
import com.ssafy.pwandora.pwa.entity.category.Category;
import com.ssafy.pwandora.pwa.entity.category.PwaCategory;
import com.ssafy.pwandora.pwa.entity.display.Display;
import com.ssafy.pwandora.pwa.entity.file.FileType;
import com.ssafy.pwandora.pwa.entity.file.PwaFile;
import com.ssafy.pwandora.pwa.entity.hashtag.Hashtag;
import com.ssafy.pwandora.pwa.entity.hashtag.PwaHashtag;
import com.ssafy.pwandora.pwa.entity.language.PwaLanguage;
import com.ssafy.pwandora.pwa.entity.permission.Permission;
import com.ssafy.pwandora.pwa.entity.permission.PwaPermission;
import com.ssafy.pwandora.pwa.entity.screenshot.Screenshot;
import com.ssafy.pwandora.pwa.entity.site.Site;
import com.ssafy.pwandora.review.entity.PwaReview;
import com.ssafy.pwandora.review.entity.Review;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
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
public class Pwa {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(unique = true, nullable = false)
	private String appId;

	private String iconImage;

	@Column(nullable = false)
	private String websiteUrl;

	@ColumnDefault("0")
	private Float avgScore;

	@ColumnDefault("0")
	private Integer downloadCount;

	private String version;

	private String company;

	private String developerSite;

	private LocalDateTime blockedAt;

	@ColumnDefault("'UNRATED'")
	@Enumerated(EnumType.STRING)
	private AgeLimit ageLimit;

	@CreatedDate
	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@LastModifiedDate
	private LocalDateTime updatedAt;

	private LocalDateTime acceptedAt;

	@ColumnDefault("'NONE'")
	@Enumerated(EnumType.STRING)
	private AcceptanceStatus acceptanceStatus;

	@OneToOne(mappedBy = "pwa", cascade = CascadeType.ALL, orphanRemoval = true)
	private Display display;

	@OneToOne(mappedBy = "pwa", cascade = CascadeType.ALL, orphanRemoval = true)
	private Site site;

	@OneToMany(mappedBy = "pwa", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Screenshot> screenshots = new ArrayList<>();

	@OneToMany(mappedBy = "pwa", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<PwaLanguage> pwaLanguages = new ArrayList<>();

	@OneToMany(mappedBy = "pwa", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<PwaCategory> pwaCategories = new ArrayList<>();

	@OneToMany(mappedBy = "pwa", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<PwaHashtag> pwaHashtags = new ArrayList<>();

	@OneToMany(mappedBy = "pwa", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<PwaPermission> pwaPermissions = new ArrayList<>();

	@OneToMany(mappedBy = "pwa", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<PwaReview> pwaReviews = new ArrayList<>();

	@OneToMany(mappedBy = "pwa", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Content> contents;

	@OneToMany(mappedBy = "pwa", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<PwaFile> files = new ArrayList<>();

	public void countDownload() {
		this.downloadCount++;
	}

	public List<Screenshot> getScreenshots() {
		return this.screenshots.stream()
			.sorted(Comparator.comparing(Screenshot::getScreenshotOrder))
			.collect(Collectors.toList());
	}

	public List<PwaCategory> getPwaCategories() {
		return this.pwaCategories.stream()
			.sorted(Comparator.comparing((PwaCategory pc) -> pc.getCategory().getCategoryOrder()))
			.collect(Collectors.toList());
	}

	public PwaFile getPwaFile(FileType fileType) {
		return this.files.stream()
			.filter(f -> f.getFileType().equals(fileType))
			.findFirst()
			.orElseThrow();
	}

	// ====== 연관관계 편의 메서드 ====== //

	public void addScreenshot(Screenshot screenshot) {
		this.screenshots.add(screenshot);
	}

	public void removeScreenshot(Screenshot screenshot) {
		this.screenshots.remove(screenshot);
	}

	public void addLanguage(Language language) {
		PwaLanguage pwaLanguage = PwaLanguage.create(this, language);
		pwaLanguages.add(pwaLanguage);
	}

	public void removeLanguage(Language language) {
		pwaLanguages.removeIf(pl -> pl.getLanguage().equals(language));
	}

	public void addCategory(Category category) {
		PwaCategory pwaCategory = PwaCategory.create(this, category);
		pwaCategories.add(pwaCategory);
	}

	public void removeCategory(Category category) {
		pwaCategories.removeIf(pc -> pc.getCategory().equals(category));
	}

	public void addHashtag(Hashtag hashtag) {
		PwaHashtag pwaHashtag = PwaHashtag.create(this, hashtag);
		pwaHashtags.add(pwaHashtag);
	}

	public void removeHashtag(Hashtag hashtag) {
		pwaHashtags.removeIf(ph -> ph.getHashtag().equals(hashtag));
	}

	public void addPermission(Permission permission) {
		PwaPermission pwaPermission = PwaPermission.create(this, permission);
		pwaPermissions.add(pwaPermission);
	}

	public void removePermission(Permission permission) {
		pwaPermissions.removeIf(pp -> pp.getPermission().equals(permission));
	}

	public void addReview(Review review) {
		PwaReview pwaReview = PwaReview.create(this, review);
		pwaReviews.add(pwaReview);
	}

	public void removeReview(Review review) {
		pwaReviews.removeIf(pr -> pr.getReview().equals(review));
	}
}
