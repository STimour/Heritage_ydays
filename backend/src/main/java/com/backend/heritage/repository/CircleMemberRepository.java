package com.backend.heritage.repository;

import com.backend.heritage.model.entity.CircleMember;
import com.backend.heritage.model.entity.Circle;
import com.backend.heritage.model.key.CircleMemberId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CircleMemberRepository extends JpaRepository<CircleMember, CircleMemberId> {

    @Query("SELECT cm FROM CircleMember cm JOIN FETCH cm.user WHERE cm.circle = :circle")
    List<CircleMember> findWithUserByCircle(@Param("circle") Circle circle);

    long countByCircle_Id(Long circleId);

    @Query("SELECT cm.id.circleId, COUNT(cm) FROM CircleMember cm WHERE cm.id.circleId IN :circleIds GROUP BY cm.id.circleId")
    List<Object[]> countByCircleIds(@Param("circleIds") List<Long> circleIds);
}
