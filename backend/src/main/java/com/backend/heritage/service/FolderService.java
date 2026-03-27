package com.backend.heritage.service;

import com.backend.heritage.dto.*;
import com.backend.heritage.model.entity.*;
import com.backend.heritage.model.key.FolderStoryId;
import com.backend.heritage.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FolderService {

    private final FolderRepository folderRepository;
    private final FolderStoryRepository folderStoryRepository;
    private final StoryRepository storyRepository;
    private final UserRepository userRepository;
    private final StoryService storyService;

    public List<FolderDTO> getMyFolders(String email, boolean isPrivate) {
        var folders = folderRepository.findByOwner_EmailAndPrivateFolder(email, isPrivate);
        if (folders.isEmpty()) return List.of();

        var folderIds = folders.stream().map(Folder::getId).toList();
        Map<Long, Long> countByFolder = folderStoryRepository.countByFolderIds(folderIds).stream()
                .collect(Collectors.toMap(row -> (Long) row[0], row -> (Long) row[1]));

        return folders.stream()
                .map(f -> FolderDTO.from(f, countByFolder.getOrDefault(f.getId(), 0L)))
                .toList();
    }

    @Transactional
    public FolderDTO createFolder(CreateFolderRequest req, String email) {
        var owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        var folder = folderRepository.save(Folder.builder()
                .name(req.name())
                .owner(owner)
                .privateFolder(req.privateFolder())
                .build());

        return FolderDTO.from(folder, 0L);
    }

    public FolderDetailDTO getFolderDetail(Long id, String email) {
        var folder = folderRepository.findByIdAndOwner_Email(id, email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        var stories = storyRepository.findByFolderId(folder.getId());
        return FolderDetailDTO.from(folder, storyService.enrichStoriesList(stories));
    }

    @Transactional
    public void deleteFolder(Long id, String email) {
        var folder = folderRepository.findByIdAndOwner_Email(id, email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        folderRepository.delete(folder);
    }

    @Transactional
    public void addStoryToFolder(Long folderId, Long storyId, String email) {
        var folder = folderRepository.findByIdAndOwner_Email(folderId, email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var story = storyRepository.findById(storyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        var id = new FolderStoryId(folderId, storyId);
        if (!folderStoryRepository.existsById(id)) {
            folderStoryRepository.save(new FolderStory(id, folder, story));
        }
    }

    @Transactional
    public void removeStoryFromFolder(Long folderId, Long storyId, String email) {
        folderRepository.findByIdAndOwner_Email(folderId, email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        folderStoryRepository.deleteById(new FolderStoryId(folderId, storyId));
    }
}
