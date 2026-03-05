package com.backend.heritage.model.entity;

import com.backend.heritage.model.enums.Visibility;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "stories")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Story {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Visibility visibility;

    @Column(name = "cover_image")
    private String coverImage;

    @Column(name = "is_commentable")
    private boolean commentable;

    @Column(columnDefinition = "TEXT")
    private String resume;

    @Column(name = "temps_lecture_calcul")
    private Integer tempsLectureCalcul;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
