package com.reviewsaver.backend.service;

import com.reviewsaver.backend.model.*;
import com.reviewsaver.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserInteractionRepository interactionRepository;
    
    @Autowired
    private UserCategoryPreferenceRepository preferenceRepository;

    public List<Review> getTrendingReviews(int limit) {
        return reviewRepository.findAll().stream()
                .sorted((a, b) -> Integer.compare(b.getUpvotes(), a.getUpvotes()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getPersonalizedRecommendations(Long userId, int limit) {
        Map<String, Object> recommendations = new HashMap<>();
        
        List<Review> userReviews = reviewRepository.findByUserId(userId);
        recommendations.put("becauseYouReviewed", userReviews.stream().limit(3).collect(Collectors.toList()));
        recommendations.put("trending", getTrendingReviews(limit));
        
        return recommendations;
    }

    @Transactional
    public void updateUserPreferences(Long userId) {
        List<Review> userReviews = reviewRepository.findByUserId(userId);
        
        Map<String, Integer> categoryCount = new HashMap<>();
        Map<String, Integer> categoryRatingSum = new HashMap<>();
        
        for (Review review : userReviews) {
            String category = review.getCategory();
            categoryCount.put(category, categoryCount.getOrDefault(category, 0) + 1);
            categoryRatingSum.put(category, categoryRatingSum.getOrDefault(category, 0) + review.getRating());
        }
        
        for (Map.Entry<String, Integer> entry : categoryCount.entrySet()) {
            String category = entry.getKey();
            int count = entry.getValue();
            int totalRating = categoryRatingSum.get(category);
            double avgRating = (double) totalRating / count;
            double score = count * avgRating;
            
            Optional<UserCategoryPreference> existing = preferenceRepository.findByUserIdAndCategory(userId, category);
            if (existing.isPresent()) {
                UserCategoryPreference pref = existing.get();
                pref.setPreferenceScore(score);
                preferenceRepository.save(pref);
            } else {
                User user = userRepository.findById(userId).orElse(null);
                if (user != null) {
                    UserCategoryPreference newPref = new UserCategoryPreference(user, category, score);
                    preferenceRepository.save(newPref);
                }
            }
        }
    }
}
