import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock: set a test user so you can see the UI
    setUser({ id: 2, name: "Test User", email: "test@example.com" });
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    localStorage.setItem('token', 'fake-jwt');
    setUser({ id: 1, name: email, email });
  };

  const register = async (userData) => {
    localStorage.setItem('token', 'fake-jwt');
    setUser({ id: 1, ...userData });
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