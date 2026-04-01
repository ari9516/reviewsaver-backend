import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import reviewService from '../services/reviewService';
import './RecommendationsPage.css';

function RecommendationsPage({ user }) {
  const [recommendations, setRecommendations] = useState({
    contentBased: [],
    trending: [],
    becauseYouReviewed: [],
    keywordBased: [],
    favoriteCategory: '',
    topKeywords: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({
    category: '',
    mood: '',
    occasion: '',
    budget: ''
  });
  const [quizRecommendations, setQuizRecommendations] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [nlpEligible, setNlpEligible] = useState(false);
  const [recommendationType, setRecommendationType] = useState('enhanced'); // 'enhanced' or 'nlp'

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://reviewsaver-backend-api.onrender.com/api';

  const categories = [
    { value: 'Movies', label: 'Movies', icon: '🎬' },
    { value: 'Electronics', label: 'Electronics', icon: '📱' },
    { value: 'Restaurants', label: 'Restaurants', icon: '🍽️' },
    { value: 'Cafes', label: 'Cafes', icon: '☕' },
    { value: 'Food', label: 'Food', icon: '🍕' }
  ];

  const moods = [
    { value: 'exciting', label: 'Exciting & Thrilling', emoji: '🔥' },
    { value: 'relaxing', label: 'Relaxing & Calm', emoji: '😌' },
    { value: 'funny', label: 'Funny & Entertaining', emoji: '😂' },
    { value: 'emotional', label: 'Emotional & Heartfelt', emoji: '😢' },
    { value: 'adventurous', label: 'Adventurous', emoji: '🏔️' }
  ];

  const occasions = [
    { value: 'alone', label: 'Alone Time', emoji: '🧘' },
    { value: 'friends', label: 'With Friends', emoji: '👥' },
    { value: 'family', label: 'With Family', emoji: '👨‍👩‍👧' },
    { value: 'date', label: 'Date Night', emoji: '💕' },
    { value: 'party', label: 'Party/Gathering', emoji: '🎉' }
  ];

  const budgets = [
    { value: 'budget', label: 'Budget Friendly', emoji: '💰' },
    { value: 'moderate', label: 'Moderate', emoji: '💵' },
    { value: 'premium', label: 'Premium', emoji: '💎' },
    { value: 'any', label: 'Any', emoji: '✨' }
  ];

  // Keyword mappings for text-based filtering
  const moodKeywords = {
    exciting: ['thrilling', 'exciting', 'action', 'edge', 'gripping', 'masterpiece', 'amazing', 'awesome', 'incredible', 'must watch', 'unforgettable'],
    relaxing: ['calm', 'relaxing', 'peaceful', 'cozy', 'soothing', 'chill', 'comfortable', 'gentle', 'easy', 'slow-paced'],
    funny: ['funny', 'hilarious', 'laugh', 'humor', 'comedy', 'entertaining', 'joke', 'witty', 'laugh out loud', 'humorous'],
    emotional: ['emotional', 'heartfelt', 'touching', 'moving', 'tear', 'feel', 'sentimental', 'poignant', 'sad', 'heartwarming'],
    adventurous: ['adventure', 'journey', 'explore', 'epic', 'quest', 'thrill', 'exciting', 'action-packed', 'wild', 'daring']
  };

  const priceKeywords = {
    budget: ['budget', 'cheap', 'affordable', 'value', 'deal', 'inexpensive', 'worth', 'good price', 'pocket-friendly', 'cost-effective'],
    moderate: ['fair', 'reasonable', 'moderate', 'decent', 'acceptable', 'good price', 'mid-range', 'average price'],
    premium: ['expensive', 'premium', 'luxury', 'high-end', 'costly', 'worth every penny', 'pricey', 'top-tier', 'exclusive', 'deluxe']
  };

  const occasionKeywords = {
    alone: ['alone', 'solo', 'by myself', 'personal', 'me time', 'individual', 'solitary', 'self', 'independent'],
    friends: ['friends', 'group', 'hangout', 'together', 'with friends', 'gathering', 'buddy', 'pals', 'group activity'],
    family: ['family', 'kids', 'children', 'parents', 'family-friendly', 'wholesome', 'all ages', 'family time', 'together'],
    date: ['date', 'romantic', 'couple', 'partner', 'romance', 'special', 'dinner date', 'intimate', 'love'],
    party: ['party', 'celebration', 'event', 'festive', 'fun', 'lively', 'crowd', 'vibrant', 'energetic', 'celebration']
  };

  // Check if user qualifies for NLP recommendations
  const checkNlpEligibility = async () => {
    const eligible = await reviewService.canUseNLP(user.id);
    setNlpEligible(eligible);
    if (eligible) {
      setRecommendationType('nlp');
    }
  };

  // Load recommendations based on user level
  const loadRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      
      if (recommendationType === 'nlp' && nlpEligible) {
        // Full NLP recommendations for engaged users
        data = await reviewService.getRecommendations(user.id);
        console.log('NLP Recommendations loaded for engaged user');
      } else {
        // Enhanced recommendations for all users
        data = await reviewService.getEnhancedRecommendations(user.id);
        console.log('Enhanced Recommendations loaded');
      }
      
      setRecommendations(data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkNlpEligibility();
  }, []);

  useEffect(() => {
    if (recommendationType) {
      loadRecommendations();
    }
  }, [recommendationType]);

  const handleQuizStart = () => {
    setShowQuiz(true);
    setQuizStep(0);
    setQuizAnswers({ category: '', mood: '', occasion: '', budget: '' });
    setQuizRecommendations([]);
  };

  const handleQuizAnswer = (field, value) => {
    setQuizAnswers(prev => ({ ...prev, [field]: value }));
    if (quizStep < 3) {
      setQuizStep(prev => prev + 1);
    } else {
      findRecommendations();
    }
  };

  const findRecommendations = async () => {
    console.log('Finding recommendations with answers:', quizAnswers);
    
    setQuizLoading(true);
    try {
      let url = `${API_BASE_URL}/reviews/category/${encodeURIComponent(quizAnswers.category)}/paged?page=0&size=50`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      let filtered = data.content || [];
      
      // Mood-based filtering
      if (quizAnswers.mood && moodKeywords[quizAnswers.mood]) {
        const keywords = moodKeywords[quizAnswers.mood];
        filtered = filtered.filter(review => {
          const text = review.reviewText.toLowerCase();
          return keywords.some(keyword => text.includes(keyword.toLowerCase()));
        });
      }
      
      // Occasion-based filtering
      if (quizAnswers.occasion && occasionKeywords[quizAnswers.occasion]) {
        const keywords = occasionKeywords[quizAnswers.occasion];
        filtered = filtered.filter(review => {
          const text = review.reviewText.toLowerCase();
          return keywords.some(keyword => text.includes(keyword.toLowerCase()));
        });
      }
      
      // Budget filtering
      if (quizAnswers.budget && quizAnswers.budget !== 'any' && priceKeywords[quizAnswers.budget]) {
        const keywords = priceKeywords[quizAnswers.budget];
        filtered = filtered.filter(review => {
          const text = review.reviewText.toLowerCase();
          return keywords.some(keyword => text.includes(keyword.toLowerCase()));
        });
      }
      
      // Rating backup
      if (quizAnswers.mood === 'exciting') {
        filtered = filtered.filter(r => r.rating >= 4);
      } else if (quizAnswers.mood === 'relaxing') {
        filtered = filtered.filter(r => r.rating >= 3 && r.rating <= 4);
      } else if (quizAnswers.mood === 'funny') {
        filtered = filtered.filter(r => r.rating >= 4);
      } else if (quizAnswers.mood === 'emotional') {
        filtered = filtered.filter(r => r.rating >= 4);
      } else if (quizAnswers.mood === 'adventurous') {
        filtered = filtered.filter(r => r.rating >= 4);
      }
      
      if (quizAnswers.budget === 'budget') {
        filtered = filtered.filter(r => r.rating >= 3 && r.rating <= 4);
      } else if (quizAnswers.budget === 'moderate') {
        filtered = filtered.filter(r => r.rating >= 4);
      } else if (quizAnswers.budget === 'premium') {
        filtered = filtered.filter(r => r.rating >= 4.5);
      }
      
      if (filtered.length === 0) {
        const fallbackResponse = await fetch(`${API_BASE_URL}/reviews/trending`);
        const fallbackData = await fallbackResponse.json();
        setQuizRecommendations(fallbackData.slice(0, 5));
      } else {
        setQuizRecommendations(filtered.slice(0, 5));
      }
      
    } catch (error) {
      console.error('Error finding recommendations:', error);
      try {
        const fallbackResponse = await fetch(`${API_BASE_URL}/reviews/trending`);
        const fallbackData = await fallbackResponse.json();
        setQuizRecommendations(fallbackData.slice(0, 5));
      } catch (fallbackError) {
        setQuizRecommendations([]);
      }
    } finally {
      setQuizLoading(false);
    }
  };

  const resetQuiz = () => {
    setShowQuiz(false);
    setQuizStep(0);
    setQuizAnswers({ category: '', mood: '', occasion: '', budget: '' });
    setQuizRecommendations([]);
  };

  const handleReviewClick = (reviewId) => {
    if (user?.id && reviewId) {
      reviewService.trackInteraction(user.id, reviewId, 'click');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="recommendations-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Finding the best recommendations for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendations-page">
        <div className="error-container">
          <p>⚠️ {error}</p>
          <button onClick={loadRecommendations} className="retry-btn">Try Again</button>
        </div>
      </div>
    );
  }

  const hasRecommendations = 
    (recommendations.contentBased?.length > 0) ||
    (recommendations.trending?.length > 0) ||
    (recommendations.becauseYouReviewed?.length > 0) ||
    (recommendations.keywordBased?.length > 0);

  return (
    <div className="recommendations-page">
      {/* Recommendation Type Badge */}
      <div className="recommendation-badge-container">
        {recommendationType === 'nlp' && nlpEligible ? (
          <div className="nlp-badge">
            <span className="nlp-icon">🧠</span>
            <span className="nlp-text">AI-Powered Recommendations</span>
            <span className="nlp-tooltip" title="Based on your review history and preferences">✨</span>
          </div>
        ) : (
          <div className="enhanced-badge">
            <span className="enhanced-icon">✨</span>
            <span className="enhanced-text">Personalized for You</span>
          </div>
        )}
      </div>

      {/* Find Your Perfect Match Button */}
      <div className="perfect-match-container">
        <button onClick={handleQuizStart} className="perfect-match-btn">
          <span className="btn-icon">✨</span>
          Find Your Perfect Match
          <span className="btn-icon">✨</span>
        </button>
        <p className="perfect-match-subtitle">Tell us what you're looking for, and we'll find the best reviews for you</p>
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="quiz-modal-overlay" onClick={resetQuiz}>
          <div className="quiz-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="quiz-close" onClick={resetQuiz}>✖</button>
            
            {quizLoading ? (
              <div className="quiz-loading">
                <div className="spinner"></div>
                <p>Finding your perfect matches...</p>
              </div>
            ) : quizRecommendations.length > 0 ? (
              <div className="quiz-results">
                <h3>🎯 Your Perfect Matches</h3>
                <div className="quiz-results-list">
                  {quizRecommendations.map(review => (
                    <a 
                      key={review.id} 
                      href={`/review/${review.id}`}
                      className="quiz-result-card"
                      onClick={() => handleReviewClick(review.id)}
                    >
                      <h4>{review.productName}</h4>
                      <span className="quiz-result-category">{review.category}</span>
                      <div className="quiz-result-rating">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                      <p>{review.reviewText.substring(0, 80)}...</p>
                      <div className="quiz-result-footer">
                        <span>👍 {review.upvotes}</span>
                        <span>📅 {formatDate(review.createdAt)}</span>
                      </div>
                    </a>
                  ))}
                </div>
                <button onClick={resetQuiz} className="quiz-done-btn">Done</button>
              </div>
            ) : (
              <>
                <div className="quiz-header">
                  <h3>✨ Find Your Perfect Match</h3>
                  <p>Answer a few questions to get personalized recommendations</p>
                </div>
                
                {/* Category Selection */}
                {quizStep === 0 && (
                  <div className="quiz-step">
                    <h4>What are you interested in?</h4>
                    <div className="quiz-options">
                      {categories.map(cat => (
                        <button
                          key={cat.value}
                          onClick={() => handleQuizAnswer('category', cat.value)}
                          className="quiz-option-btn"
                        >
                          {cat.icon} {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Mood Selection */}
                {quizStep === 1 && (
                  <div className="quiz-step">
                    <h4>What's your mood today?</h4>
                    <div className="quiz-options">
                      {moods.map(mood => (
                        <button
                          key={mood.value}
                          onClick={() => handleQuizAnswer('mood', mood.value)}
                          className="quiz-option-btn"
                        >
                          {mood.emoji} {mood.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Occasion Selection */}
                {quizStep === 2 && (
                  <div className="quiz-step">
                    <h4>Who are you with?</h4>
                    <div className="quiz-options">
                      {occasions.map(occasion => (
                        <button
                          key={occasion.value}
                          onClick={() => handleQuizAnswer('occasion', occasion.value)}
                          className="quiz-option-btn"
                        >
                          {occasion.emoji} {occasion.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Budget Selection */}
                {quizStep === 3 && (
                  <div className="quiz-step">
                    <h4>What's your budget preference?</h4>
                    <div className="quiz-options">
                      {budgets.map(budget => (
                        <button
                          key={budget.value}
                          onClick={() => handleQuizAnswer('budget', budget.value)}
                          className="quiz-option-btn"
                        >
                          {budget.emoji} {budget.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* No Results State */}
                {quizStep === 4 && quizRecommendations.length === 0 && (
                  <div className="quiz-no-results">
                    <p>😔 No exact matches found for your preferences.</p>
                    <p>Try different options or check out trending reviews!</p>
                    <div className="quiz-no-results-buttons">
                      <button onClick={() => setQuizStep(0)} className="quiz-try-again-btn">
                        Try Again
                      </button>
                      <button onClick={resetQuiz} className="quiz-browse-btn">
                        Browse All
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Regular Recommendations */}
      {!showQuiz && (
        <>
          {!hasRecommendations ? (
            <div className="no-recommendations">
              <p>📭 No recommendations yet. Start reviewing to get personalized suggestions!</p>
              <Link to="/" className="start-reviewing-btn">Start Reviewing →</Link>
            </div>
          ) : (
            <>
              {/* Keyword-based recommendations (Enhanced tier only) */}
              {recommendationType === 'enhanced' && recommendations.keywordBased?.length > 0 && (
                <div className="rec-section">
                  <div className="rec-section-header">
                    <h2>🔍 Based on Your Favorite Words</h2>
                    <p>We found these using keywords from your reviews</p>
                  </div>
                  <div className="rec-cards-grid">
                    {recommendations.keywordBased.map(review => (
                      <a 
                        key={review.id} 
                        href={`/review/${review.id}`}
                        className="rec-card keyword-card"
                        onClick={() => handleReviewClick(review.id)}
                      >
                        <div className="rec-card-header">
                          <h3>{review.productName}</h3>
                          <span className="rec-category-badge">{review.category}</span>
                        </div>
                        <div className="rec-rating">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                        <p className="rec-review-text">"{review.reviewText.substring(0, 100)}..."</p>
                        <div className="rec-card-footer">
                          <div className="rec-user">
                            <span className="rec-user-icon">👤</span>
                            {review.user?.email?.split('@')[0]}
                          </div>
                          <div className="rec-upvotes">
                            👍 {review.upvotes} upvotes
                          </div>
                        </div>
                        <div className="rec-date">📅 {formatDate(review.createdAt)}</div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Recommendations */}
              {recommendations.trending?.length > 0 && (
                <div className="rec-section">
                  <div className="rec-section-header">
                    <h2>🔥 Trending Now</h2>
                    <p>Most popular reviews this week</p>
                  </div>
                  <div className="rec-cards-grid">
                    {recommendations.trending.map(review => (
                      <a 
                        key={review.id} 
                        href={`/review/${review.id}`}
                        className="rec-card trending-card"
                        onClick={() => handleReviewClick(review.id)}
                      >
                        <div className="rec-card-header">
                          <h3>{review.productName}</h3>
                          <span className="rec-category-badge">{review.category}</span>
                        </div>
                        <div className="rec-rating">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                        <p className="rec-review-text">"{review.reviewText.substring(0, 100)}..."</p>
                        <div className="rec-card-footer">
                          <div className="rec-user">
                            <span className="rec-user-icon">👤</span>
                            {review.user?.email?.split('@')[0]}
                          </div>
                          <div className="rec-upvotes">
                            👍 {review.upvotes} upvotes
                          </div>
                        </div>
                        <div className="rec-date">📅 {formatDate(review.createdAt)}</div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Personalized Recommendations (Category-based) */}
              {recommendations.contentBased?.length > 0 && (
                <div className="rec-section">
                  <div className="rec-section-header">
                    <h2>🎯 Personalized For You</h2>
                    <p>Based on your favorite categories</p>
                  </div>
                  <div className="rec-cards-grid">
                    {recommendations.contentBased.map(review => (
                      <a 
                        key={review.id} 
                        href={`/review/${review.id}`}
                        className="rec-card personalized-card"
                        onClick={() => handleReviewClick(review.id)}
                      >
                        <div className="rec-card-header">
                          <h3>{review.productName}</h3>
                          <span className="rec-category-badge">{review.category}</span>
                        </div>
                        <div className="rec-rating">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                        <p className="rec-review-text">"{review.reviewText.substring(0, 100)}..."</p>
                        <div className="rec-card-footer">
                          <div className="rec-user">
                            <span className="rec-user-icon">👤</span>
                            {review.user?.email?.split('@')[0]}
                          </div>
                          <div className="rec-upvotes">
                            👍 {review.upvotes} upvotes
                          </div>
                        </div>
                        <div className="rec-date">📅 {formatDate(review.createdAt)}</div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Because You Reviewed */}
              {recommendations.becauseYouReviewed?.length > 0 && (
                <div className="rec-section">
                  <div className="rec-section-header">
                    <h2>📝 Because You Reviewed...</h2>
                    <p>Similar to what you've enjoyed</p>
                  </div>
                  <div className="rec-cards-grid">
                    {recommendations.becauseYouReviewed.map(review => (
                      <a 
                        key={review.id} 
                        href={`/review/${review.id}`}
                        className="rec-card because-card"
                        onClick={() => handleReviewClick(review.id)}
                      >
                        <div className="rec-card-header">
                          <h3>{review.productName}</h3>
                          <span className="rec-category-badge">{review.category}</span>
                        </div>
                        <div className="rec-rating">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                        <p className="rec-review-text">"{review.reviewText.substring(0, 100)}..."</p>
                        <div className="rec-card-footer">
                          <div className="rec-user">
                            <span className="rec-user-icon">👤</span>
                            {review.user?.email?.split('@')[0]}
                          </div>
                          <div className="rec-date">📅 {formatDate(review.createdAt)}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default RecommendationsPage;
