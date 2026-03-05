package com.backend.heritage.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "story_reads")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class StoryRead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "story_id", nullable = false)
    private Story story;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "temps_lecture")
    private Integer tempsLecture;

    @CreationTimestamp
    @Column(name = "read_at", updatable = false)
    private LocalDateTime readAt;
}
