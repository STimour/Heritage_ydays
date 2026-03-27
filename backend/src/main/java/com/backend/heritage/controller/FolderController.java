package com.backend.heritage.controller;

import com.backend.heritage.dto.CreateFolderRequest;
import com.backend.heritage.dto.FolderDTO;
import com.backend.heritage.dto.FolderDetailDTO;
import com.backend.heritage.service.FolderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
@RequiredArgsConstructor
public class FolderController {

    private final FolderService folderService;

    @GetMapping
    public List<FolderDTO> getMyFolders(
            @RequestParam(defaultValue = "false") boolean isPrivate,
            Authentication auth
    ) {
        return folderService.getMyFolders(auth.getName(), isPrivate);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FolderDTO createFolder(@RequestBody @Valid CreateFolderRequest req, Authentication auth) {
        return folderService.createFolder(req, auth.getName());
    }

    @GetMapping("/{id}")
    public FolderDetailDTO getFolderDetail(@PathVariable Long id, Authentication auth) {
        return folderService.getFolderDetail(id, auth.getName());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFolder(@PathVariable Long id, Authentication auth) {
        folderService.deleteFolder(id, auth.getName());
    }

    @PostMapping("/{id}/stories/{storyId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void addStory(@PathVariable Long id, @PathVariable Long storyId, Authentication auth) {
        folderService.addStoryToFolder(id, storyId, auth.getName());
    }

    @DeleteMapping("/{id}/stories/{storyId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeStory(@PathVariable Long id, @PathVariable Long storyId, Authentication auth) {
        folderService.removeStoryFromFolder(id, storyId, auth.getName());
    }
}
