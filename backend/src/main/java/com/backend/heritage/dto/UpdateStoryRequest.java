package com.backend.heritage.dto;

import com.backend.heritage.model.enums.Theme;
import com.backend.heritage.model.enums.Visibility;

import java.util.List;

public record UpdateStoryRequest(
        String title,
        String content,
        String coverImage,
        Visibility visibility,
        Theme mainTheme,
        List<String> tags
) {}
