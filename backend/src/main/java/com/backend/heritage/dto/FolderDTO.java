package com.backend.heritage.dto;

import com.backend.heritage.model.entity.Folder;

import java.time.LocalDateTime;

public record FolderDTO(
        Long id,
        String name,
        boolean privateFolder,
        long storyCount,
        LocalDateTime createdAt
) {
    public static FolderDTO from(Folder folder, long storyCount) {
        return new FolderDTO(folder.getId(), folder.getName(),
                folder.isPrivateFolder(), storyCount, folder.getCreatedAt());
    }
}
