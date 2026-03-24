import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function FollowButton({ userId, initialIsFollowing }) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  // Don't show follow button for the logged-in user
  if (!user || user.id === userId) return null;

  const handleFollow = async () => {
    setLoading(true);
    try {
      // Mock API call – just simulate delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsFollowing(!isFollowing);
      console.log(`User ${userId} ${isFollowing ? 'unfollowed' : 'followed'}`);
    } catch (error) {
      console.error('Follow action failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-4 py-2 rounded text-sm font-medium transition ${
        isFollowing 
          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
      {loading ? '...' : (isFollowing ? 'Unfollow' : 'Follow')}
    </button>
  );
}