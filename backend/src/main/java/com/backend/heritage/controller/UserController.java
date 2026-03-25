package com.backend.heritage.controller;

import com.backend.heritage.dto.UpdateProfileRequest;
import com.backend.heritage.dto.UserProfileDTO;
import com.backend.heritage.dto.UserSearchResultDTO;
import com.backend.heritage.service.FriendService;
import com.backend.heritage.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final FriendService friendService;

    @GetMapping("/me")
    public UserProfileDTO getMyProfile(Authentication auth) {
        return userService.getMyProfile(auth.getName());
    }

    @PutMapping("/me")
    public UserProfileDTO updateProfile(@RequestBody UpdateProfileRequest req, Authentication auth) {
        return userService.updateProfile(req, auth.getName());
    }

    @GetMapping("/search")
    public List<UserSearchResultDTO> search(@RequestParam String q, Authentication auth) {
        return friendService.searchUsers(q, auth.getName());
    }

    @GetMapping("/{id}")
    public UserProfileDTO getPublicProfile(@PathVariable Long id) {
        return userService.getPublicProfile(id);
    }
}
