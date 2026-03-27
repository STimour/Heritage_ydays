package com.backend.heritage.repository;

import com.backend.heritage.model.entity.StoryInterest;
import com.backend.heritage.model.key.StoryInterestId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StoryInterestRepository extends JpaRepository<StoryInterest, StoryInterestId> {

    @Query("SELECT si.id.storyId, COUNT(si) FROM StoryInterest si WHERE si.id.storyId IN :storyIds GROUP BY si.id.storyId")
    List<Object[]> countByStoryIds(@Param("storyIds") List<Long> storyIds);

    long countById_UserId(Long userId);
}
