package com.backend.heritage.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.backend.heritage.dto.CircleDTO;
import com.backend.heritage.dto.CreateCircleRequest;
import com.backend.heritage.model.entity.Circle;
import com.backend.heritage.model.entity.CircleMember;
import com.backend.heritage.model.key.CircleMemberId;
import com.backend.heritage.repository.CircleMemberRepository;
import com.backend.heritage.repository.CircleRepository;
import com.backend.heritage.repository.StoryCircleRepository;
import com.backend.heritage.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CircleService {

    private final CircleRepository circleRepository;
    private final CircleMemberRepository circleMemberRepository;
    private final StoryCircleRepository storyCircleRepository;
    private final UserRepository userRepository;

    public List<CircleDTO> getMyCircles(String email) {
        var circles = circleRepository.findByOwner_Email(email);
        if (circles.isEmpty()) return List.of();

        var circleIds = circles.stream().map(Circle::getId).toList();
        Map<Long, Long> countByCircle = circleMemberRepository.countByCircleIds(circleIds).stream()
                .collect(Collectors.toMap(row -> (Long) row[0], row -> (Long) row[1]));

        return circles.stream()
            .map(c -> CircleDTO.from(c,
                countByCircle.getOrDefault(c.getId(), 0L),
                storyCircleRepository.countByCircle_Id(c.getId())))
                .toList();
    }

    @Transactional
    public CircleDTO createCircle(CreateCircleRequest req, String email) {
        var owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        var circle = circleRepository.save(Circle.builder()
                .name(req.name())
                .description(req.description())
                .owner(owner)
                .build());

        long memberCount = 0;
        if (req.memberIds() != null) {
            for (Long userId : req.memberIds()) {
                var member = userRepository.findById(userId);
                if (member.isPresent()) {
                    circleMemberRepository.save(new CircleMember(
                            new CircleMemberId(circle.getId(), userId), circle, member.get()));
                    memberCount++;
                }
            }
        }

        return CircleDTO.from(circle, memberCount, 0L);
    }

    @Transactional
    public void addMember(Long circleId, Long userId, String email) {
        var circle = circleRepository.findByIdAndOwner_Email(circleId, email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        var id = new CircleMemberId(circleId, userId);
        if (!circleMemberRepository.existsById(id)) {
            circleMemberRepository.save(new CircleMember(id, circle, user));
        }
    }

    @Transactional
    public void removeMember(Long circleId, Long userId, String email) {
        circleRepository.findByIdAndOwner_Email(circleId, email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        circleMemberRepository.deleteById(new CircleMemberId(circleId, userId));
    }

    @Transactional
    public void deleteCircle(Long id, String email) {
        var circle = circleRepository.findByIdAndOwner_Email(id, email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        circleRepository.delete(circle);
    }
}
