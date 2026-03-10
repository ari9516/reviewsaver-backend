import React, { useState, useEffect } from 'react';
import reviewService from '../services/reviewService';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewService.getReviews(page, 5, category);
      setReviews(data.content || []);
      setTotalPages(data.totalPages || 0);
      console.log('Loaded reviews:', data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [page, category]);

  const handleUpvote = async (id) => {
    await reviewService.upvote(id);
    loadReviews();
  };

  const handleDownvote = async (id) => {
    await reviewService.downvote(id);
    loadReviews();
  };

  if (loading) return <div className="p-4 text-center">Loading reviews...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reviews ({reviews.length})</h1>
      
      {/* Category Filter */}
      <select 
        value={category} 
        onChange={(e) => {
          setCategory(e.target.value);
          setPage(0);
        }}
        className="mb-4 p-2 border rounded"
      >
        <option value="all">All Categories</option>
        <option value="Movies">Movies</option>
        <option value="Electronics">Electronics</option>
        <option value="Restaurants">Restaurants</option>
        <option value="Cafes">Cafes</option>
        <option value="Food">Food</option>
      </select>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="border p-4 rounded shadow">
            <h3 className="font-bold text-lg">{review.productName}</h3>
            <p className="text-sm text-gray-600">{review.category} • Rating: {review.rating}/5</p>
            <p className="my-2 italic">"{review.reviewText}"</p>
            <div className="flex gap-2 mt-2">
              <button 
                onClick={() => handleUpvote(review.id)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                👍 {review.upvotes || 0}
              </button>
              <button 
                onClick={() => handleDownvote(review.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                👎 {review.downvotes || 0}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage(p => Math.max(0, p-1))}
            disabled={page === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages-1, p+1))}
            disabled={page === totalPages-1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;