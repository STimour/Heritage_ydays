package com.backend.heritage.controller;

import com.backend.heritage.dto.CircleDTO;
import com.backend.heritage.dto.CreateCircleRequest;
import com.backend.heritage.service.CircleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/circles")
@RequiredArgsConstructor
public class CircleController {

    private final CircleService circleService;

    @GetMapping
    public List<CircleDTO> getMyCircles(Authentication auth) {
        return circleService.getMyCircles(auth.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CircleDTO createCircle(@RequestBody @Valid CreateCircleRequest req, Authentication auth) {
        return circleService.createCircle(req, auth.getName());
    }

    @PostMapping("/{id}/members/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void addMember(@PathVariable Long id, @PathVariable Long userId, Authentication auth) {
        circleService.addMember(id, userId, auth.getName());
    }

    @DeleteMapping("/{id}/members/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeMember(@PathVariable Long id, @PathVariable Long userId, Authentication auth) {
        circleService.removeMember(id, userId, auth.getName());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCircle(@PathVariable Long id, Authentication auth) {
        circleService.deleteCircle(id, auth.getName());
    }
}
