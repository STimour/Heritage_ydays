package com.backend.heritage.repository;

import com.backend.heritage.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("""
            SELECT u FROM User u
            WHERE u.email != :excludeEmail
            AND (LOWER(u.displayName) LIKE LOWER(CONCAT('%', :q, '%'))
                 OR LOWER(u.pseudo) LIKE LOWER(CONCAT('%', :q, '%')))
            """)
    List<User> search(@Param("q") String q, @Param("excludeEmail") String excludeEmail);
}
