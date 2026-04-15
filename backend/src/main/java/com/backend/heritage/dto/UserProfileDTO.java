package com.backend.heritage.dto;

import com.backend.heritage.model.entity.User;

public record UserProfileDTO(
        Long id,
        String displayName,
    String email,
        String pseudo,
        String photo,
        long storyCount,
        long folderCount,
        long savedCount
) {
    public static UserProfileDTO from(User user, long storyCount, long folderCount, long savedCount) {
    return new UserProfileDTO(user.getId(), user.getDisplayName(), user.getEmail(), user.getPseudo(),
                user.getPhoto(), storyCount, folderCount, savedCount);
    }
}
