package com.backend.heritage.model.entity;

import com.backend.heritage.model.key.StoryCircleId;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "story_circles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class StoryCircle {

    @EmbeddedId
    private StoryCircleId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("storyId")
    @JoinColumn(name = "story_id")
    private Story story;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("circleId")
    @JoinColumn(name = "circle_id")
    private Circle circle;
}
