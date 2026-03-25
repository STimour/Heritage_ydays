package com.backend.heritage.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @NotBlank(message = "Le nom complet est obligatoire")
        String fullName,

        @Email(message = "Email invalide")
        @NotBlank(message = "L'email est obligatoire")
        String email,

        @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
        @NotBlank(message = "Le mot de passe est obligatoire")
        String password
) {}
