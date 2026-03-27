package com.backend.heritage.controller;

import com.backend.heritage.dto.ContactDTO;
import com.backend.heritage.dto.FriendRequestDTO;
import com.backend.heritage.service.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendController {

    private final FriendService friendService;

    @GetMapping
    public List<ContactDTO> getContacts(Authentication auth) {
        return friendService.getContacts(auth.getName());
    }

    @DeleteMapping("/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFriend(@PathVariable Long userId, Authentication auth) {
        friendService.removeFriend(userId, auth.getName());
    }

    @PostMapping("/requests/{userId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void sendRequest(@PathVariable Long userId, Authentication auth) {
        friendService.sendRequest(userId, auth.getName());
    }

    @GetMapping("/requests")
    public List<FriendRequestDTO> getPendingRequests(Authentication auth) {
        return friendService.getPendingRequests(auth.getName());
    }

    @PostMapping("/requests/{id}/accept")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void acceptRequest(@PathVariable Long id, Authentication auth) {
        friendService.acceptRequest(id, auth.getName());
    }

    @DeleteMapping("/requests/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void rejectRequest(@PathVariable Long id, Authentication auth) {
        friendService.rejectRequest(id, auth.getName());
    }
}
