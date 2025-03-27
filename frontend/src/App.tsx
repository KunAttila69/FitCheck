import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import NotificationsPage from './pages/NotificationsPage/NotificationsPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import FriendsPage from './pages/FollowingPage/FollowingPage';
import EditPage from './pages/EditPage/EditPage';
import LeaderboardPage from './pages/LeaderboardPage/LeaderboardPage';
import UploadPage from './pages/UploadPage/UploadPage';
import { useState, useEffect } from 'react';
import { getUserProfile } from './services/authServices';
import { Link } from 'react-router-dom';
import FollowingPage from './pages/FollowingPage/FollowingPage';
import UserNotFoundPage from './pages/UserNotFoundPage/UserNotFoundPage';

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

function UnauthorizedPage() {
  return (
    <div className="unauthorized">
      <h1>You are not signed in</h1>
      <p>Please sign in to access the site.</p>
      <Link to="/login">
        <button>Go to Login</button>
      </Link>
    </div>
  );
}

function App() {   
  const [profile, setProfile] = useState<UserProfile | null>(null); 
  const [loading, setLoading] = useState<boolean>(true); 

  const fetchProfile = async () => {
    try {
      const res = await getUserProfile();
      if (res) {
        setProfile(res);
      }
    } catch (err) { 
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {localStorage.getItem("access") ? (
          <>
            <Route index element={<HomePage profile={profile} />} />
            <Route path='/notifications' element={<NotificationsPage profile={profile}/>} />
            <Route path='/following' element={<FollowingPage profile={profile}/>} />
            <Route path='/edit' element={<EditPage profile={profile} />} />
            <Route path='/leaderboard' element={<LeaderboardPage profile={profile}/>} />
            <Route path='/profile/:username' element={<ProfilePage yourName={profile?.name}/>} />
            <Route path='/profile/not-found' element={<UserNotFoundPage />} />
            <Route path='/upload' element={<UploadPage profile={profile}/>} />
            <Route path='/login' element={<Navigate to="/" replace />} />
            <Route path='/signup' element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path='/' element={<UnauthorizedPage />} /> 
            <Route path='/login' element={<LoginPage fetchProfile={fetchProfile}/>} />
            <Route path='/signup' element={<SignUpPage />} />
            <Route path='*' element={<UnauthorizedPage />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
