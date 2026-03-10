import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import reviewService from '../services/reviewService';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const getDeviceHash = () => {
    let hash = localStorage.getItem('deviceHash');
    if (!hash) {
      hash = 'device_' + Math.random().toString(36).substring(2);
      localStorage.setItem('deviceHash', hash);
    }
    return hash;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const deviceHash = getDeviceHash();
    const data = await reviewService.login(email, deviceHash);
    if (data.userId) {
      login({ id: data.userId, email });
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl mb-4">Login</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mb-4 border rounded" required />
      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded">
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

export default LoginPage;