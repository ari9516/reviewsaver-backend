package com.reviewsaver.backend.repository;

import com.reviewsaver.backend.model.UserCategoryPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserCategoryPreferenceRepository extends JpaRepository<UserCategoryPreference, Long> {
    List<UserCategoryPreference> findByUserIdOrderByPreferenceScoreDesc(Long userId);
    Optional<UserCategoryPreference> findByUserIdAndCategory(Long userId, String category);
}
