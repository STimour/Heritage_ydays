package com.backend.heritage.service;

import com.backend.heritage.dto.*;
import com.backend.heritage.model.entity.*;
import com.backend.heritage.model.enums.Theme;
import com.backend.heritage.model.enums.Visibility;
import com.backend.heritage.model.key.FolderStoryId;
import com.backend.heritage.model.key.StoryCircleId;
import com.backend.heritage.model.key.StoryInterestId;
import com.backend.heritage.model.key.StoryTagId;
import com.backend.heritage.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
public class StoryService {

    private final StoryRepository storyRepository;
    private final StoryTagRepository storyTagRepository;
    private final StoryInterestRepository storyInterestRepository;
    private final StoryCircleRepository storyCircleRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final CircleRepository circleRepository;
    private final FolderRepository folderRepository;
    private final FolderStoryRepository folderStoryRepository;

    public Page<StoryFeedItemDTO> getFeed(Theme theme, Pageable pageable) {
        var stories = theme != null
                ? storyRepository.findByVisibilityAndMainTheme(Visibility.PUBLIC, theme, pageable)
                : storyRepository.findByVisibility(Visibility.PUBLIC, pageable);
        return enrichToFeedPage(stories, pageable);
    }

    public StoryDetailDTO getDetail(Long id) {
        var story = storyRepository.findByIdAndVisibility(id, Visibility.PUBLIC)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        long saveCount = batchSaveCounts(List.of(id)).getOrDefault(id, 0L);

        List<String> tagNames = storyTagRepository.findWithTagByStoryIdIn(List.of(id))
                .stream().map(st -> st.getTag().getName()).toList();

        List<StoryFeedItemDTO> suggestions = tagNames.isEmpty() ? List.of()
                : enrichToFeedPage(
                        storyRepository.findSuggestions(tagNames, id, PageRequest.of(0, 5)),
                        PageRequest.of(0, 5)
                ).getContent();

        return StoryDetailDTO.from(story, saveCount, suggestions);
    }

    @Transactional
    public StoryDetailDTO create(CreateStoryRequest req, String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        var story = storyRepository.save(Story.builder()
                .author(user)
                .title(req.title())
                .content(req.content())
                .coverImage(req.coverImage())
                .visibility(req.visibility())
                .mainTheme(req.mainTheme())
                .published(req.visibility() == Visibility.PUBLIC)
                .build());

        if (req.tags() != null && !req.tags().isEmpty()) {
            for (String tagName : req.tags()) {
                var tag = tagRepository.findByName(tagName)
                        .orElseGet(() -> tagRepository.save(Tag.builder().name(tagName).build()));
                storyTagRepository.save(new StoryTag(new StoryTagId(story.getId(), tag.getId()), story, tag));
            }
        }

        if (req.circleId() != null && req.visibility() == Visibility.CUSTOM) {
            var circle = circleRepository.findById(req.circleId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
            storyCircleRepository.save(new StoryCircle(
                    new StoryCircleId(story.getId(), circle.getId()), story, circle));
        }

        if (req.folderId() != null) {
            var folder = folderRepository.findByIdAndOwner_Email(req.folderId(), email)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
            folderStoryRepository.save(new FolderStory(
                    new FolderStoryId(folder.getId(), story.getId()), folder, story));
        }

        return StoryDetailDTO.from(story, 0L, List.of());
    }

    public Page<LibraryStoryDTO> getMyLibrary(String email, Pageable pageable) {
        var stories = storyRepository.findByAuthor_Email(email, pageable);
        List<Long> ids = stories.map(Story::getId).toList();
        if (ids.isEmpty()) return Page.empty(pageable);

        Map<Long, Long> saveCountByStory = batchSaveCounts(ids);
        Map<Long, List<String>> tagsByStory = batchTagNames(ids);
        return stories.map(s -> LibraryStoryDTO.from(s,
                saveCountByStory.getOrDefault(s.getId(), 0L),
                tagsByStory.getOrDefault(s.getId(), List.of())));
    }

    @Transactional
    public boolean toggleSave(Long storyId, String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        var story = storyRepository.findById(storyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        var id = new StoryInterestId(storyId, user.getId());
        if (storyInterestRepository.existsById(id)) {
            storyInterestRepository.deleteById(id);
            return false;
        } else {
            storyInterestRepository.save(new StoryInterest(id, story, user, null));
            return true;
        }
    }

    // Package-private : utilisé par FolderService
    Page<StoryFeedItemDTO> enrichToFeedPage(Page<Story> stories, Pageable pageable) {
        List<Long> ids = stories.map(Story::getId).toList();
        if (ids.isEmpty()) return Page.empty(pageable);
        Map<Long, Long> saveCountByStory = batchSaveCounts(ids);
        Map<Long, List<String>> tagsByStory = batchTagNames(ids);
        return stories.map(s -> StoryFeedItemDTO.from(s,
                saveCountByStory.getOrDefault(s.getId(), 0L),
                tagsByStory.getOrDefault(s.getId(), List.of())));
    }

    // Package-private : utilisé par FolderService
    List<StoryFeedItemDTO> enrichStoriesList(List<Story> stories) {
        if (stories.isEmpty()) return List.of();
        List<Long> ids = stories.stream().map(Story::getId).toList();
        Map<Long, Long> saveCountByStory = batchSaveCounts(ids);
        Map<Long, List<String>> tagsByStory = batchTagNames(ids);
        return stories.stream()
                .map(s -> StoryFeedItemDTO.from(s,
                        saveCountByStory.getOrDefault(s.getId(), 0L),
                        tagsByStory.getOrDefault(s.getId(), List.of())))
                .toList();
    }

    private Map<Long, Long> batchSaveCounts(List<Long> ids) {
        return storyInterestRepository.countByStoryIds(ids).stream()
                .collect(Collectors.toMap(row -> (Long) row[0], row -> (Long) row[1]));
    }

    private Map<Long, List<String>> batchTagNames(List<Long> ids) {
        return storyTagRepository.findWithTagByStoryIdIn(ids).stream()
                .collect(Collectors.groupingBy(
                        st -> st.getId().getStoryId(),
                        Collectors.mapping(st -> st.getTag().getName(), Collectors.toList())
                ));
    }
}
