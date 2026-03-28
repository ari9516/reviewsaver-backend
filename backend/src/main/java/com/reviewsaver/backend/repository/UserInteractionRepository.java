package com.reviewsaver.backend.repository;

import com.reviewsaver.backend.model.UserInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserInteractionRepository extends JpaRepository<UserInteraction, Long> {
    List<UserInteraction> findByUserId(Long userId);
}
