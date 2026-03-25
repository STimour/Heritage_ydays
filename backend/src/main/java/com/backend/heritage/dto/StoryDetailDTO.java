package com.backend.heritage.dto;

import com.backend.heritage.model.entity.Story;

import java.time.LocalDateTime;
import java.util.List;

public record StoryDetailDTO(
        Long id,
        String title,
        String resume,
        String content,
        String mainTheme,
        LocalDateTime createdAt,
        String coverImage,
        Long authorId,
        String authorName,
        String authorPhoto,
        long saveCount,
        List<StoryFeedItemDTO> suggestions
) {
    public static StoryDetailDTO from(Story story, long saveCount, List<StoryFeedItemDTO> suggestions) {
        return new StoryDetailDTO(
                story.getId(),
                story.getTitle(),
                story.getResume(),
                story.getContent(),
                story.getMainTheme() != null ? story.getMainTheme().name() : null,
                story.getCreatedAt(),
                story.getCoverImage(),
                story.getAuthor().getId(),
                story.getAuthor().getDisplayName(),
                story.getAuthor().getPhoto(),
                saveCount,
                suggestions
        );
    }
}
