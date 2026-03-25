package com.backend.heritage.dto;

import com.backend.heritage.model.entity.User;

public record ContactDTO(Long id, String displayName, String pseudo, String photo) {

    public static ContactDTO from(User user) {
        return new ContactDTO(user.getId(), user.getDisplayName(), user.getPseudo(), user.getPhoto());
    }
}
