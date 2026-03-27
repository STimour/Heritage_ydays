package com.backend.heritage.dto;

import com.backend.heritage.model.entity.User;

public record UserSearchResultDTO(
        Long id,
        String displayName,
        String pseudo,
        String photo,
        boolean alreadyFriend,
        boolean pendingRequest
) {
    public static UserSearchResultDTO from(User user, boolean alreadyFriend, boolean pendingRequest) {
        return new UserSearchResultDTO(user.getId(), user.getDisplayName(),
                user.getPseudo(), user.getPhoto(), alreadyFriend, pendingRequest);
    }
}
