package com.backend.heritage.repository;

import com.backend.heritage.model.entity.Circle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CircleRepository extends JpaRepository<Circle, Long> {

    List<Circle> findByOwner_Email(String email);

    Optional<Circle> findByIdAndOwner_Email(Long id, String email);
}
