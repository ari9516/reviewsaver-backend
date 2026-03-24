import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import FollowButton from '../components/FollowButton';
import { mockUsers } from '../services/mockData';
import { useAuth } from '../context/AuthContext';

export default function FollowersPage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      // Mock: return all users except the profile itself
      const all = mockUsers.filter(u => u.id !== parseInt(id));
      setFollowers(all);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) return <div className="p-4 text-center">Loading followers...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Followers</h1>
      <div className="space-y-3">
        {followers.map(user => (
          <div key={user.id} className="flex items-center gap-4 p-3 border rounded">
            <img src={user.avatar} className="w-10 h-10 rounded-full" />
            <Link to={`/profile/${user.id}`} className="flex-1 font-medium">
              {user.name}
            </Link>
            <FollowButton userId={user.id} initialIsFollowing={user.isFollowing} />
          </div>
        ))}
      </div>
    </div>
  );
}