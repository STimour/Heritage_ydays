package com.backend.heritage.dto;

import com.backend.heritage.model.enums.Theme;
import com.backend.heritage.model.enums.Visibility;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CreateStoryRequest(
        @NotBlank String title,
        @NotBlank String content,
        String coverImage,
        @NotNull Visibility visibility,
        Theme mainTheme,
        List<String> tags,
        Long folderId,
        Long circleId
) {}
