import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    // Mock login – store a fake token and user
    localStorage.setItem('token', 'fake-jwt-token');
    const userData = { id: 1, name: 'Test User', email };
    setUser(userData);
    return { user: userData, token: 'fake-token' };
  };

  const register = async (userData) => {
    localStorage.setItem('token', 'fake-jwt-token');
    const newUser = { id: 1, ...userData };
    setUser(newUser);
    return { user: newUser, token: 'fake-token' };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};