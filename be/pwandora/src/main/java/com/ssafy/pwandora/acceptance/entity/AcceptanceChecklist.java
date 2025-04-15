package com.ssafy.pwandora.acceptance.entity;

import com.ssafy.pwandora.pwa.entity.Pwa;
import jakarta.persistence.*;
import lombok.*;

/* PWA 검수 체크리스트 엔티티 */
@Entity
@Table(name = "acceptance_checklist")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AcceptanceChecklist {

    @Id
    @Column(name = "pwa_id")
    private Integer pwaId;

    @MapsId
    @OneToOne
    @JoinColumn(name = "pwa_id")
    private Pwa pwa;

    @Column(name = "crawled_status")
    private String crawledStatus;

    @Column(name = "display_status")
    private String displayStatus;

    @Column(name = "screenshot_status")
    private String screenshotStatus;

    @Column(name = "ai_suggestion_status")
    private String aiSuggestionStatus;

    @Column(name = "ai_censor_status")
    private String aiCensorStatus;

    @Column(name = "packaging_status")
    private String packagingStatus;

    @Column(name = "lighthouse_status")
    private String lighthouseStatus;

    @Column(name = "security_status")
    private String securityStatus;
}