import React, { useState, useEffect } from 'react';
import reviewService from '../services/reviewService';
import { Link } from 'react-router-dom';

function HomePage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewService.getReviews(0, 10)
      .then(data => setReviews(data.content || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading reviews...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Latest Reviews</h1>
      <div className="grid gap-4">
        {reviews.map(review => (
          <Link to={`/review/${review.id}`} key={review.id} className="border p-4 rounded shadow">
            <h2 className="font-bold text-lg">{review.productName}</h2>
            <p className="text-gray-600">{review.category} • Rating: {review.rating}/5</p>
            <p className="mt-2">"{review.reviewText}"</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;