package com.backend.heritage.repository;

import com.backend.heritage.model.entity.FriendRequest;
import com.backend.heritage.model.entity.User;
import com.backend.heritage.model.enums.FriendRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {

    boolean existsBySenderAndReceiver(User sender, User receiver);

    List<FriendRequest> findByReceiver_EmailAndStatus(String email, FriendRequestStatus status);

    @Query("""
            SELECT fr FROM FriendRequest fr
            JOIN FETCH fr.sender JOIN FETCH fr.receiver
            WHERE (fr.sender.email = :email OR fr.receiver.email = :email)
            AND fr.status = 'ACCEPTED'
            """)
    List<FriendRequest> findAllFriends(@Param("email") String email);

    Optional<FriendRequest> findByIdAndReceiver_Email(Long id, String email);

    List<FriendRequest> findBySender_EmailAndStatus(String email, FriendRequestStatus status);

    @Query("""
            SELECT fr FROM FriendRequest fr
            WHERE fr.status = 'ACCEPTED'
            AND ((fr.sender.email = :email AND fr.receiver.id = :otherId)
              OR (fr.receiver.email = :email AND fr.sender.id = :otherId))
            """)
    Optional<FriendRequest> findFriendship(@Param("email") String email, @Param("otherId") Long otherId);
}
