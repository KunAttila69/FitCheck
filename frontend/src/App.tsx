import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import NotificationsPage from './pages/NotificationsPage/NotificationsPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import FriendsPage from './pages/FriendsPage/FriendsPage';
import EditPage from './pages/EditPage/EditPage';
import LeaderboardPage from './pages/LeaderboardPage/LeaderboardPage';
import UploadPage from './pages/UploadPage/UploadPage';
import { useState, useEffect } from 'react';
import { getUserProfile } from './services/authServices';
import { Link } from 'react-router-dom';
 
function UnauthorizedPage() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate("/")
  },[])

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
  const [profile, setProfile] = useState(null); 

  const fetchProfile = async () => {
    try {
      const res = await getUserProfile();
      if (res) {
        setProfile(res);
      }
    } catch (err) { 
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {profile ? (
          <>
            <Route index element={<HomePage fetchProfile={fetchProfile} />} />
            <Route path='/notifications' element={<NotificationsPage />} />
            <Route path='/friends' element={<FriendsPage />} />
            <Route path='/edit' element={<EditPage />} />
            <Route path='/leaderboard' element={<LeaderboardPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/upload' element={<UploadPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignUpPage />} /> 
          </>
        ) : (
          <>
            <Route path='/' element={<UnauthorizedPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignUpPage />} /> 
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
