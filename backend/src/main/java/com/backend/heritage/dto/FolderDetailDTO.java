package com.backend.heritage.dto;

import com.backend.heritage.model.entity.Folder;

import java.util.List;

public record FolderDetailDTO(
        Long id,
        String name,
        boolean privateFolder,
        String tone,
        String description,
        List<StoryFeedItemDTO> stories
) {
    public static FolderDetailDTO from(Folder folder, List<StoryFeedItemDTO> stories) {
        return new FolderDetailDTO(folder.getId(), folder.getName(),
                folder.isPrivateFolder(), folder.getTone(), folder.getDescription(), stories);
    }
}
