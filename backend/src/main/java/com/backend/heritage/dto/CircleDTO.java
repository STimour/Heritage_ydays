package com.backend.heritage.dto;

import java.time.LocalDateTime;

import com.backend.heritage.model.entity.Circle;

public record CircleDTO(
        Long id,
        String name,
        String description,
        long memberCount,
        long storyCount,
        LocalDateTime createdAt
) {
    public static CircleDTO from(Circle circle, long memberCount, long storyCount) {
        return new CircleDTO(circle.getId(), circle.getName(),
                circle.getDescription(), memberCount, storyCount, circle.getCreatedAt());
    }
}
