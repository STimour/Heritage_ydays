package com.backend.heritage.dto;

import com.backend.heritage.model.entity.Circle;

import java.time.LocalDateTime;

public record CircleDTO(
        Long id,
        String name,
        String description,
        long memberCount,
        LocalDateTime createdAt
) {
    public static CircleDTO from(Circle circle, long memberCount) {
        return new CircleDTO(circle.getId(), circle.getName(),
                circle.getDescription(), memberCount, circle.getCreatedAt());
    }
}
