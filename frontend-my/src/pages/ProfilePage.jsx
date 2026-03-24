import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FollowButton from '../components/FollowButton';
import { mockUsers } from '../services/mockData';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const found = mockUsers.find(u => u.id === parseInt(id));
      setProfile(found);
      if (found && currentUser) {
        // In mock, we just check if the logged-in user is following this profile
        // For now, we'll use the profile's isFollowing flag (for demo)
        setIsFollowing(found.isFollowing);
      }
      setLoading(false);
    }, 500);
  }, [id, currentUser]);

  if (loading) return <div className="p-4 text-center">Loading profile...</div>;
  if (!profile) return <div className="p-4 text-center">User not found.</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-6">
        <img 
          src={profile.avatar} 
          alt={profile.name} 
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-gray-600 mt-1">{profile.bio}</p>
          <div className="mt-3">
            <FollowButton userId={profile.id} initialIsFollowing={isFollowing} />
          </div>
        </div>
      </div>
    </div>
  );
}