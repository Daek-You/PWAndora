package com.ssafy.pwandora.acceptance.entity;

import com.ssafy.pwandora.pwa.entity.Pwa;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "content_moderation_reasoning")
@Getter
@Setter
public class ContentModerationReasoning {

    @Id
    @Column(name = "pwa_id")
    private Integer pwaId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "pwa_id")
    private Pwa pwa;

    @Column(name = "child_endangerment_reason", columnDefinition = "TEXT")
    private String childEndangermentReason;

    @Column(name = "inappropriate_content_reason", columnDefinition = "TEXT")
    private String inappropriateContentReason;

    @Column(name = "financial_service_reason", columnDefinition = "TEXT")
    private String financialServiceReason;

    @Column(name = "real_money_gambling_reason", columnDefinition = "TEXT")
    private String realMoneyGamblingReason;

    @Column(name = "illegal_activity_reason", columnDefinition = "TEXT")
    private String illegalActivityReason;

    @Column(name = "health_content_service_reason", columnDefinition = "TEXT")
    private String healthContentServiceReason;

    @Column(name = "blockchain_based_content_reason", columnDefinition = "TEXT")
    private String blockchainBasedContentReason;

    @Column(name = "ai_generated_content_reason", columnDefinition = "TEXT")
    private String aiGeneratedContentReason;

    @Column(name = "overall_assessment", columnDefinition = "TEXT")
    private String overallAssessment;
}