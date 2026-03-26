import React, { useState } from 'react';
import './Login.css';
import reviewService from '../services/reviewService';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateDeviceHash = () => {
    let hash = localStorage.getItem('deviceHash');
    if (!hash) {
      hash = 'device_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('deviceHash', hash);
    }
    return hash;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const deviceHash = generateDeviceHash();
      console.log('Logging in with:', { email, deviceHash });
      
      const data = await reviewService.login(email, deviceHash);
      console.log('Login response:', data);
      
      if (data && data.userId) {
        onLogin({ id: data.userId, email });
      } else {
        setError(data?.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login to ReviewSaver</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="info-text">
        Any email works - we'll create an account automatically!
      </p>
    </div>
  );
}

export default Login;