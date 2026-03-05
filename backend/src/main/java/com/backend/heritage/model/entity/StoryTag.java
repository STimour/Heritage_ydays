package com.backend.heritage.model.entity;

import com.backend.heritage.model.key.StoryTagId;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "story_tags")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class StoryTag {

    @EmbeddedId
    private StoryTagId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("storyId")
    @JoinColumn(name = "story_id")
    private Story story;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("tagId")
    @JoinColumn(name = "tag_id")
    private Tag tag;
}
