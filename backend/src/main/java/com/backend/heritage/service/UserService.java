package com.backend.heritage.service;

import com.backend.heritage.dto.UpdateProfileRequest;
import com.backend.heritage.dto.UserProfileDTO;
import com.backend.heritage.model.entity.User;
import com.backend.heritage.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final StoryRepository storyRepository;
    private final FolderRepository folderRepository;
    private final StoryInterestRepository storyInterestRepository;

    public UserProfileDTO getMyProfile(String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return buildProfile(user);
    }

    @Transactional
    public UserProfileDTO updateProfile(UpdateProfileRequest req, String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        if (req.displayName() != null) user.setDisplayName(req.displayName());
        if (req.pseudo() != null) user.setPseudo(req.pseudo());
        if (req.photo() != null) user.setPhoto(req.photo());

        return buildProfile(user);
    }

    public UserProfileDTO getPublicProfile(Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return buildProfile(user);
    }

    private UserProfileDTO buildProfile(User user) {
        long storyCount = storyRepository.countByAuthor_Email(user.getEmail());
        long folderCount = folderRepository.countByOwner_Email(user.getEmail());
        long savedCount = storyInterestRepository.countById_UserId(user.getId());
        return UserProfileDTO.from(user, storyCount, folderCount, savedCount);
    }
}
