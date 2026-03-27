package com.backend.heritage.repository;

import com.backend.heritage.model.entity.FolderStory;
import com.backend.heritage.model.key.FolderStoryId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FolderStoryRepository extends JpaRepository<FolderStory, FolderStoryId> {

    @Query("SELECT fs.id.folderId, COUNT(fs) FROM FolderStory fs WHERE fs.id.folderId IN :ids GROUP BY fs.id.folderId")
    List<Object[]> countByFolderIds(@Param("ids") List<Long> ids);
}
