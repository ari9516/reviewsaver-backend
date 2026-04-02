import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';
import RecommendationsPage from './components/RecommendationsPage';
import ReviewForm from './components/ReviewForm';
import ReviewList from './components/ReviewList';
import UserReviewsModal from './components/UserReviewsModal';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalSortType, setModalSortType] = useState('all');
  const [userStats, setUserStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://reviewsaver-backend-api.onrender.com/api';

  // Check for existing session on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    
    if (token && userId) {
      setUser({ id: parseInt(userId), email: userEmail });
    }
    setLoading(false);
  }, []);

  const loadUserStats = useCallback(async () => {
    if (!user?.id) return;
    
    setLoadingStats(true);
    setStatsError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setUserStats(data);
    } catch (error) {
      console.error('Error loading user stats:', error);
      setStatsError('Could not load stats');
    } finally {
      setLoadingStats(false);
    }
  }, [user?.id, API_BASE_URL]);

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user, loadUserStats]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('deviceHash');
    setUser(null);
    setUserStats(null);
    setStatsError(null);
  };

  const handleReviewAdded = () => {
    setRefreshKey(prev => prev + 1);
    loadUserStats();
  };

  const handleStatsClick = (type) => {
    let title = '';
    let icon = '';
    switch (type) {
      case 'all':
        icon = '📝';
        title = `${icon} All Your Reviews (${userStats?.totalReviews || 0} total)`;
        setModalSortType('all');
        break;
      case 'upvotes':
        icon = '⭐';
        title = `${icon} Most Upvoted Reviews (👍 ${userStats?.totalUpvotes || 0} total upvotes)`;
        setModalSortType('upvotes');
        break;
      case 'downvotes':
        icon = '⚠️';
        title = `${icon} Most Downvoted Reviews (👎 ${userStats?.totalDownvotes || 0} total downvotes)`;
        setModalSortType('downvotes');
        break;
      case 'recent':
        icon = '🕐';
        title = `${icon} Most Recent Reviews (Latest ${userStats?.totalReviews || 0} reviews)`;
        setModalSortType('recent');
        break;
      default:
        title = 'Your Reviews';
        setModalSortType('all');
    }
    setModalTitle(title);
    setModalOpen(true);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    console.log(`Welcome ${userData.email}!`);
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="App">
        {/* Only show header when user is logged in */}
        {user && (
          <header className="app-header">
            <div className="header-content">
              {/* Logo Section - Left */}
              <div className="logo-section">
                <h1>🎬 ReviewSaver</h1>
                <p className="tagline">India's #1 Review Platform — Trusted by 50,000+ users</p>
              </div>
              
              {/* Navigation Section - Right */}
              <nav className="app-nav">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  🏠 Dashboard
                </NavLink>
                
                {/* Recommendations with MUST TRY Badge */}
                <div className="nav-item-with-badge">
                  <NavLink 
                    to="/recommendations" 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    ✨ Recommendations
                  </NavLink>
                  <div className="must-try-badge-nav">✨ MUST TRY ✨</div>
                </div>
                
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  👤 My Profile
                </NavLink>
                <button onClick={handleLogout} className="logout-nav-btn">
                  🚪 Logout
                </button>
              </nav>
            </div>
          </header>
        )}
        
        <main>
          <Routes>
            {/* Auth Routes - Redirect to dashboard if already logged in */}
            <Route path="/login" element={
              !user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />
            } />
            <Route path="/register" element={
              !user ? <Register /> : <Navigate to="/" />
            } />
            
            {/* Protected Routes - Redirect to login if not logged in */}
            <Route path="/" element={
              user ? (
                <div className="app-container">
                  <Dashboard 
                    user={user} 
                    userStats={userStats}
                    loadingStats={loadingStats}
                    statsError={statsError}
                    onStatsClick={handleStatsClick} 
                    onRefresh={loadUserStats}
                  />
                  <div className="content-section">
                    <div className="form-section">
                      <ReviewForm 
                        user={user} 
                        onReviewAdded={handleReviewAdded}
                      />
                    </div>
                    <div className="reviews-section">
                      <ReviewList 
                        key={refreshKey}
                        user={user} 
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/recommendations" element={
              user ? (
                <RecommendationsPage user={user} />
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/profile" element={
              user ? (
                <ProfilePage 
                  user={user} 
                  userStats={userStats} 
                  onRefresh={loadUserStats} 
                />
              ) : (
                <Navigate to="/login" />
              )
            } />
          </Routes>
        </main>

        <UserReviewsModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          userId={user?.id}
          title={modalTitle}
          sortType={modalSortType}
        />

        {user && (
          <button 
            className="fab" 
            onClick={() => document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth' })}
            title="Write a review"
          >
            ✍️
          </button>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
