package com.backend.heritage.repository;

import com.backend.heritage.model.entity.StoryTag;
import com.backend.heritage.model.key.StoryTagId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StoryTagRepository extends JpaRepository<StoryTag, StoryTagId> {

    @Query("SELECT st FROM StoryTag st JOIN FETCH st.tag WHERE st.id.storyId IN :storyIds")
    List<StoryTag> findWithTagByStoryIdIn(@Param("storyIds") List<Long> storyIds);
}
