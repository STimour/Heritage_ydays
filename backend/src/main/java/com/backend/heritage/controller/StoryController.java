package com.backend.heritage.controller;

import com.backend.heritage.dto.*;
import com.backend.heritage.model.enums.Theme;
import com.backend.heritage.service.StoryService;
import java.util.Map;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stories")
@RequiredArgsConstructor
public class StoryController {

    private final StoryService storyService;

    @GetMapping
    public Page<StoryFeedItemDTO> getFeed(
            @RequestParam(required = false) Theme theme,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return storyService.getFeed(theme, PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    @GetMapping("/library")
    public Page<LibraryStoryDTO> getMyLibrary(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return storyService.getMyLibrary(auth.getName(), PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    @GetMapping("/{id}")
    public StoryDetailDTO getDetail(@PathVariable Long id) {
        return storyService.getDetail(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StoryDetailDTO create(@RequestBody @Valid CreateStoryRequest req, Authentication auth) {
        return storyService.create(req, auth.getName());
    }

    @PostMapping("/{id}/save")
    public Map<String, Boolean> toggleSave(@PathVariable Long id, Authentication auth) {
        boolean saved = storyService.toggleSave(id, auth.getName());
        return Map.of("saved", saved);
    }
}
