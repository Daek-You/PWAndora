package com.ssafy.pwandora.event.entity;

import com.ssafy.pwandora.language.entity.Language;
import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Getter
@Setter
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"event_id", "language_id"})
})
public class EventContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title = "No Information";

    @Column(length = 2000)
    private String description = "No Information";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "language_id", nullable = false)
    private Language language;
}
