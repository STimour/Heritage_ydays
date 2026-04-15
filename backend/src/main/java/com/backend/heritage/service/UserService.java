package com.backend.heritage.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.backend.heritage.dto.UpdateProfileRequest;
import com.backend.heritage.dto.UserProfileDTO;
import com.backend.heritage.model.entity.User;
import com.backend.heritage.repository.FolderRepository;
import com.backend.heritage.repository.StoryInterestRepository;
import com.backend.heritage.repository.StoryRepository;
import com.backend.heritage.repository.UserRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final StoryRepository storyRepository;
    private final FolderRepository folderRepository;
    private final StoryInterestRepository storyInterestRepository;

    @PersistenceContext
    private EntityManager entityManager;

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

    @Transactional
    public void deleteMyAccount(String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        Long userId = user.getId();

        entityManager.createNativeQuery("DELETE FROM story_interests WHERE user_id = :userId OR story_id IN (SELECT id FROM stories WHERE author_id = :userId)")
            .setParameter("userId", userId)
            .executeUpdate();
        entityManager.createNativeQuery("DELETE FROM folder_stories WHERE story_id IN (SELECT id FROM stories WHERE author_id = :userId) OR folder_id IN (SELECT id FROM folders WHERE owner_id = :userId)")
            .setParameter("userId", userId)
            .executeUpdate();
        entityManager.createNativeQuery("DELETE FROM story_circles WHERE story_id IN (SELECT id FROM stories WHERE author_id = :userId)")
            .setParameter("userId", userId)
            .executeUpdate();
        entityManager.createNativeQuery("DELETE FROM story_tags WHERE story_id IN (SELECT id FROM stories WHERE author_id = :userId)")
            .setParameter("userId", userId)
            .executeUpdate();
        entityManager.createNativeQuery("DELETE FROM circle_members WHERE user_id = :userId OR circle_id IN (SELECT id FROM circles WHERE owner_id = :userId)")
            .setParameter("userId", userId)
            .executeUpdate();
        entityManager.createNativeQuery("DELETE FROM friend_requests WHERE sender_id = :userId OR receiver_id = :userId")
            .setParameter("userId", userId)
            .executeUpdate();
        entityManager.createNativeQuery("DELETE FROM circles WHERE owner_id = :userId")
            .setParameter("userId", userId)
            .executeUpdate();
        entityManager.createNativeQuery("DELETE FROM folders WHERE owner_id = :userId")
            .setParameter("userId", userId)
            .executeUpdate();
        entityManager.createNativeQuery("DELETE FROM stories WHERE author_id = :userId")
            .setParameter("userId", userId)
            .executeUpdate();

        userRepository.delete(user);
    }

    private UserProfileDTO buildProfile(User user) {
        long storyCount = storyRepository.countByAuthor_Email(user.getEmail());
        long folderCount = folderRepository.countByOwner_Email(user.getEmail());
        long savedCount = storyInterestRepository.countById_UserId(user.getId());
        return UserProfileDTO.from(user, storyCount, folderCount, savedCount);
    }
}
