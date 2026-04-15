package com.backend.heritage.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class JwtSecretValidator {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.dev-secret}")
    private String devSecret;

    @Value("${spring.profiles.active:}")
    private String activeProfiles;

    @PostConstruct
    public void validate() {
        boolean isProd = activeProfiles.contains("prod");
        if (isProd && (jwtSecret == null || jwtSecret.isBlank() || jwtSecret.equals(devSecret))) {
            throw new IllegalStateException("JWT_SECRET doit être défini en production avec une clé forte en Base64");
        }
    }
}
