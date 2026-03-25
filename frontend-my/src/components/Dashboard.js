import React, { useState, useEffect } from 'react';
import reviewService from '../services/reviewService';
import './Dashboard.css';

function Dashboard({ user, onStatsClick }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const statsData = await reviewService.getUserStats(user.id);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleStatClick = (type) => {
    if (onStatsClick) {
      onStatsClick(type);
    }
  };

  if (loading && !stats) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-emoji">👤</span>
        </div>
        <div className="profile-info">
          <h1>{stats?.email || user.email}</h1>
          <p className="member-since">
            🗓️ Member since: {stats?.memberSince ? formatDate(stats.memberSince) : formatDate(user.createdAt)}
          </p>
        </div>
      </div>

      {/* Stats Cards - CLICKABLE */}
      <div className="stats-grid">
        <div 
          className="stat-card clickable" 
          onClick={() => handleStatClick('all')}
          title="Click to see all your reviews"
        >
          <div className="stat-value">{stats?.totalReviews || 0}</div>
          <div className="stat-label">Total Reviews</div>
          <div className="stat-hint">📝 Click to view</div>
        </div>
        
        <div 
          className="stat-card clickable upvote-stat" 
          onClick={() => handleStatClick('upvotes')}
          title="Click to see your most upvoted reviews"
        >
          <div className="stat-value">👍 {stats?.totalUpvotes || 0}</div>
          <div className="stat-label">Upvotes Received</div>
          <div className="stat-hint">⭐ Click to sort</div>
        </div>
        
        <div 
          className="stat-card clickable downvote-stat" 
          onClick={() => handleStatClick('downvotes')}
          title="Click to see your most downvoted reviews"
        >
          <div className="stat-value">👎 {stats?.totalDownvotes || 0}</div>
          <div className="stat-label">Downvotes Received</div>
          <div className="stat-hint">⚠️ Click to sort</div>
        </div>
        
        <div 
          className="stat-card clickable" 
          onClick={() => handleStatClick('recent')}
          title="Click to see your most recent reviews"
        >
          <div className="stat-value">{stats?.totalReviews || 0}</div>
          <div className="stat-label">Reviews Written</div>
          <div className="stat-hint">🕐 Click for recent</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;