package com.backend.heritage.dto;

import com.backend.heritage.model.entity.FriendRequest;

import java.time.LocalDateTime;

public record FriendRequestDTO(
        Long id,
        Long senderId,
        String senderName,
        String senderPhoto,
        LocalDateTime createdAt
) {
    public static FriendRequestDTO from(FriendRequest fr) {
        return new FriendRequestDTO(fr.getId(), fr.getSender().getId(),
                fr.getSender().getDisplayName(), fr.getSender().getPhoto(), fr.getCreatedAt());
    }
}
