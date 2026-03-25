import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
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

  const handleLogout = () => {
    setUser(null);
  };

  const handleReviewAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleStatsClick = (type) => {
    let title = '';
    switch (type) {
      case 'all':
        title = '📝 All Your Reviews';
        setModalSortType('all');
        break;
      case 'upvotes':
        title = '⭐ Most Upvoted Reviews';
        setModalSortType('upvotes');
        break;
      case 'downvotes':
        title = '⚠️ Most Downvoted Reviews';
        setModalSortType('downvotes');
        break;
      case 'recent':
        title = '🕐 Most Recent Reviews';
        setModalSortType('recent');
        break;
      default:
        title = 'Your Reviews';
        setModalSortType('all');
    }
    setModalTitle(title);
    setModalOpen(true);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎬 ReviewSaver</h1>
        <p className="tagline">India's #1 Review Platform</p>
      </header>
      
      <main>
        {!user ? (
          <Login onLogin={setUser} />
        ) : (
          <div className="app-container">
            {/* Dashboard Section - Clickable Stats */}
            <Dashboard user={user} onStatsClick={handleStatsClick} />
            
            {/* Combined Content */}
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
        )}
      </main>

      {/* Modal for viewing user's reviews */}
      <UserReviewsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        userId={user?.id}
        title={modalTitle}
        sortType={modalSortType}
      />
    </div>
  );
}

export default App;
