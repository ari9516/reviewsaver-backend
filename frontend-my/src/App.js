import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import FollowersPage from './pages/FollowersPage';
import FollowingPage from './pages/FollowingPage';
import TrendingPage from './pages/TrendingPage';
import LeaderboardPage from './pages/LeaderboardPage';

function App() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div className="p-4 text-center">Loading app...</div>;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="font-bold text-xl">ReviewSaver</Link>
            <div className="space-x-4">
              <Link to="/trending">Trending</Link>
              <Link to="/leaderboard">Leaderboard</Link>
              {user ? (
                <>
                  <Link to={`/profile/${user.id}`}>Profile</Link>
                  <button onClick={logout} className="text-red-500">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </>
              )}
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/profile/:id/followers" element={<FollowersPage />} />
          <Route path="/profile/:id/following" element={<FollowingPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;