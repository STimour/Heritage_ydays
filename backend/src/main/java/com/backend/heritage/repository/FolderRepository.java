package com.backend.heritage.repository;

import com.backend.heritage.model.entity.Folder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FolderRepository extends JpaRepository<Folder, Long> {

    List<Folder> findByOwner_EmailAndPrivateFolder(String email, boolean privateFolder);

    Optional<Folder> findByIdAndOwner_Email(Long id, String email);

    long countByOwner_Email(String email);
}
