package com.backend.heritage.service;

import com.backend.heritage.dto.ContactDTO;
import com.backend.heritage.dto.FriendRequestDTO;
import com.backend.heritage.dto.UserSearchResultDTO;
import com.backend.heritage.model.entity.FriendRequest;
import com.backend.heritage.model.enums.FriendRequestStatus;
import com.backend.heritage.repository.FriendRequestRepository;
import com.backend.heritage.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FriendService {

    private final FriendRequestRepository friendRequestRepository;
    private final UserRepository userRepository;

    @Transactional
    public void sendRequest(Long targetId, String senderEmail) {
        var sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        var receiver = userRepository.findById(targetId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        boolean alreadyExists = friendRequestRepository.existsBySenderAndReceiver(sender, receiver)
                || friendRequestRepository.existsBySenderAndReceiver(receiver, sender);
        if (alreadyExists) throw new ResponseStatusException(HttpStatus.CONFLICT);

        friendRequestRepository.save(FriendRequest.builder()
                .sender(sender)
                .receiver(receiver)
                .build());
    }

    public List<FriendRequestDTO> getPendingRequests(String email) {
        return friendRequestRepository
                .findByReceiver_EmailAndStatus(email, FriendRequestStatus.PENDING)
                .stream().map(FriendRequestDTO::from).toList();
    }

    @Transactional
    public void acceptRequest(Long requestId, String email) {
        var request = friendRequestRepository.findByIdAndReceiver_Email(requestId, email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        request.setStatus(FriendRequestStatus.ACCEPTED);
    }

    @Transactional
    public void rejectRequest(Long requestId, String email) {
        var request = friendRequestRepository.findByIdAndReceiver_Email(requestId, email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        friendRequestRepository.delete(request);
    }

    public List<ContactDTO> getContacts(String email) {
        return friendRequestRepository.findAllFriends(email).stream()
                .map(fr -> fr.getSender().getEmail().equals(email) ? fr.getReceiver() : fr.getSender())
                .map(ContactDTO::from)
                .toList();
    }

    @Transactional
    public void removeFriend(Long userId, String email) {
        var friendship = friendRequestRepository.findFriendship(email, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        friendRequestRepository.delete(friendship);
    }

    public List<UserSearchResultDTO> searchUsers(String q, String email) {
        var users = userRepository.search(q, email);
        if (users.isEmpty()) return List.of();

        Set<Long> friendIds = friendRequestRepository.findAllFriends(email).stream()
                .map(fr -> fr.getSender().getEmail().equals(email)
                        ? fr.getReceiver().getId() : fr.getSender().getId())
                .collect(Collectors.toSet());

        Set<Long> pendingTargetIds = friendRequestRepository
                .findBySender_EmailAndStatus(email, FriendRequestStatus.PENDING).stream()
                .map(fr -> fr.getReceiver().getId())
                .collect(Collectors.toSet());

        return users.stream()
                .map(u -> UserSearchResultDTO.from(u,
                        friendIds.contains(u.getId()),
                        pendingTargetIds.contains(u.getId())))
                .toList();
    }
}
