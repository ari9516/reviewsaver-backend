import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';
import { mockTrending } from '../services/mockData';

export default function HomePage() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    // Get first 3 trending items for homepage
    setTimeout(() => {
      setTrending(mockTrending.slice(0, 3));
    }, 300);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">Welcome to ReviewSaver</h1>
      <p className="text-gray-600 mb-8">Discover and share reviews!</p>

      {/* Trending Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">🔥 Trending Now</h2>
          <Link to="/trending" className="text-blue-600 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trending.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      {/* You can add other sections like "Recent Reviews" later */}
    </div>
  );
}