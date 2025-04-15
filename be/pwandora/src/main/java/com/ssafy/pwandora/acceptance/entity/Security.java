package com.ssafy.pwandora.acceptance.entity;

import com.ssafy.pwandora.pwa.entity.Pwa;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "security")
@Getter
@Setter
public class Security {

    @Id
    @Column(name = "pwa_id")
    private Integer pwaId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "pwa_id")
    private Pwa pwa;

    @Column(name = "https")
    private Boolean https;

    @Column(name = "csp")
    private Boolean csp;
}