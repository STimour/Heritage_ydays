package com.backend.heritage.dto;

public record UpdateProfileRequest(
        String displayName,
        String pseudo,
        String photo
) {}
