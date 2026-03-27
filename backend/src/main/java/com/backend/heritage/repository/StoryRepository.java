package com.backend.heritage.repository;

import com.backend.heritage.model.entity.Story;
import com.backend.heritage.model.enums.Theme;
import com.backend.heritage.model.enums.Visibility;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StoryRepository extends JpaRepository<Story, Long> {

    @EntityGraph(attributePaths = "author")
    Page<Story> findByVisibility(Visibility visibility, Pageable pageable);

    @EntityGraph(attributePaths = "author")
    Page<Story> findByVisibilityAndMainTheme(Visibility visibility, Theme mainTheme, Pageable pageable);

    @EntityGraph(attributePaths = "author")
    Optional<Story> findByIdAndVisibility(Long id, Visibility visibility);

    @EntityGraph(attributePaths = "author")
    Page<Story> findByAuthor_Email(String email, Pageable pageable);

    @EntityGraph(attributePaths = "author")
    @Query("""
            SELECT DISTINCT s FROM Story s
            JOIN StoryTag st ON st.story = s
            WHERE s.visibility = 'PUBLIC'
            AND st.tag.name IN :tagNames
            AND s.id != :excludeId
            """)
    Page<Story> findSuggestions(
            @Param("tagNames") List<String> tagNames,
            @Param("excludeId") Long excludeId,
            Pageable pageable);

    @EntityGraph(attributePaths = "author")
    @Query("""
            SELECT DISTINCT s FROM Story s
            JOIN FolderStory fs ON fs.story = s
            WHERE fs.folder.id = :folderId
            """)
    List<Story> findByFolderId(@Param("folderId") Long folderId);

    long countByAuthor_Email(String email);
}
