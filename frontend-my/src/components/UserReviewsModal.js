import React, { useState, useEffect } from 'react';
import reviewService from '../services/reviewService';
import './UserReviewsModal.css';

function UserReviewsModal({ isOpen, onClose, userId, title, sortType }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (isOpen && userId) {
      loadReviews();
    }
  }, [isOpen, userId, page, sortType]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      let data;
      switch (sortType) {
        case 'upvotes':
          data = await reviewService.getUserReviewsByUpvotes(userId, page, 10);
          break;
        case 'downvotes':
          data = await reviewService.getUserReviewsByDownvotes(userId, page, 10);
          break;
        case 'recent':
          data = await reviewService.getUserReviewsRecent(userId, page, 10);
          break;
        default:
          data = await reviewService.getMyReviews(userId, page, 10);
      }
      setReviews(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>✖</button>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <div className="loading">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="no-reviews">No reviews found</div>
          ) : (
            <>
              <div className="reviews-list">
                {reviews.map(review => (
                  <div key={review.id} className="modal-review-card">
                    <div className="review-header-modal">
                      <h3>{review.productName}</h3>
                      <span className="category-badge">{review.category}</span>
                    </div>
                    <div className="review-rating">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                    </div>
                    <p className="review-text">"{review.reviewText}"</p>
                    <div className="review-footer-modal">
                      <div className="vote-stats">
                        <span>👍 {review.upvotes}</span>
                        <span>👎 {review.downvotes}</span>
                      </div>
                      <div className="review-date">
                        📅 {formatDate(review.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="modal-pagination">
                  <button
                    onClick={() => setPage(p => Math.max(0, p-1))}
                    disabled={page === 0}
                  >
                    ← Previous
                  </button>
                  <span>Page {page + 1} of {totalPages}</span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages-1, p+1))}
                    disabled={page === totalPages-1}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserReviewsModal;