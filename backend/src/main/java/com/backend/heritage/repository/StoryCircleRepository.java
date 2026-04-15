package com.backend.heritage.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.heritage.model.entity.StoryCircle;
import com.backend.heritage.model.key.StoryCircleId;

public interface StoryCircleRepository extends JpaRepository<StoryCircle, StoryCircleId> {
	long countByCircle_Id(Long circleId);
}
