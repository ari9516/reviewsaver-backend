package com.reviewsaver.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_category_preferences")
public class UserCategoryPreference {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    private String category;
    
    private Double preferenceScore;
    
    public UserCategoryPreference() {}
    
    public UserCategoryPreference(User user, String category, Double preferenceScore) {
        this.user = user;
        this.category = category;
        this.preferenceScore = preferenceScore;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Double getPreferenceScore() { return preferenceScore; }
    public void setPreferenceScore(Double preferenceScore) { this.preferenceScore = preferenceScore; }
}
