import React, { useState } from 'react';
import Login from './components/Login';
import ReviewList from './components/ReviewList';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  console.log('Current user:', user); // Add this debug line

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
          <>
            <div className="user-welcome">
              Welcome, {user.email}!
            </div>
            <ReviewList user={user} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;