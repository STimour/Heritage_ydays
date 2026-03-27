package com.backend.heritage.dto;

import com.backend.heritage.model.entity.Story;

import java.time.LocalDateTime;
import java.util.List;

public record StoryFeedItemDTO(
        Long id,
        String title,
        String preview,
        List<String> tags,
        String mainTheme,
        LocalDateTime createdAt,
        String coverImage,
        String authorName,
        long saveCount
) {
    private static final int PREVIEW_LENGTH = 120;

    public static StoryFeedItemDTO from(Story story, long saveCount, List<String> tags) {
        String content = story.getContent();
        String preview = (content != null && content.length() > PREVIEW_LENGTH)
                ? content.substring(0, PREVIEW_LENGTH) + "..."
                : content;

        return new StoryFeedItemDTO(
                story.getId(),
                story.getTitle(),
                preview,
                tags,
                story.getMainTheme() != null ? story.getMainTheme().name() : null,
                story.getCreatedAt(),
                story.getCoverImage(),
                story.getAuthor().getDisplayName(),
                saveCount
        );
    }
}
