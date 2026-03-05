package com.backend.heritage.model.entity;

import com.backend.heritage.model.key.FolderShareId;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "folder_shares")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class FolderShare {

    @EmbeddedId
    private FolderShareId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("folderId")
    @JoinColumn(name = "folder_id")
    private Folder folder;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @CreationTimestamp
    @Column(name = "shared_at", updatable = false)
    private LocalDateTime sharedAt;
}
