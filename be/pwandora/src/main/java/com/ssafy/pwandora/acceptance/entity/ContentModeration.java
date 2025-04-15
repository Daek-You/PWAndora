package com.ssafy.pwandora.acceptance.entity;

import com.ssafy.pwandora.pwa.entity.Pwa;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "content_moderation")
@Getter
@Setter
public class ContentModeration {

    @Id
    @Column(name = "pwa_id")
    private Integer pwaId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "pwa_id")
    private Pwa pwa;

    @Column(name = "child_endangerment")
    private Integer childEndangerment;

    @Column(name = "inappropriate_content")
    private Integer inappropriateContent;

    @Column(name = "financial_service")
    private Integer financialService;

    @Column(name = "real_money_gambling")
    private Integer realMoneyGambling;

    @Column(name = "illegal_activity")
    private Integer illegalActivity;

    @Column(name = "health_content_service")
    private Integer healthContentService;

    @Column(name = "blockchain_based_content")
    private Integer blockchainBasedContent;

    @Column(name = "ai_generated_content")
    private Integer aiGeneratedContent;
}