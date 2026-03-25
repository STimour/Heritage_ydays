package com.backend.heritage.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateFolderRequest(
        @NotBlank String name,
        boolean privateFolder
) {}
