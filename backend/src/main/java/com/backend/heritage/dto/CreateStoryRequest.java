package com.backend.heritage.dto;

import java.util.List;

import com.backend.heritage.model.enums.Theme;
import com.backend.heritage.model.enums.Visibility;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateStoryRequest(
        @NotBlank String title,
        @NotBlank String content,
        String resume,
        String coverImage,
        @NotNull Visibility visibility,
        Theme mainTheme,
        List<String> tags,
        Long folderId,
        Long circleId,
        Boolean isPublished
) {}
