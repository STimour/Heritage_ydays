package com.backend.heritage.model.entity;

import com.backend.heritage.model.key.CircleMemberId;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "circle_members")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CircleMember {

    @EmbeddedId
    private CircleMemberId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("circleId")
    @JoinColumn(name = "circle_id")
    private Circle circle;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;
}
