package com.backend.heritage.repository;

import com.backend.heritage.model.entity.StoryCircle;
import com.backend.heritage.model.key.StoryCircleId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoryCircleRepository extends JpaRepository<StoryCircle, StoryCircleId> {
}
