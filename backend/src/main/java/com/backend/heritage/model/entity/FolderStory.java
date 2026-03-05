package com.backend.heritage.model.entity;

import com.backend.heritage.model.key.FolderStoryId;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "folder_stories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class FolderStory {

    @EmbeddedId
    private FolderStoryId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("folderId")
    @JoinColumn(name = "folder_id")
    private Folder folder;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("storyId")
    @JoinColumn(name = "story_id")
    private Story story;
}
