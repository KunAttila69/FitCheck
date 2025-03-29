import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import NotificationsPage from './pages/NotificationsPage/NotificationsPage';
import ProfilePage from './pages/ProfilePage/ProfilePage'; 
import EditPage from './pages/EditPage/EditPage';
import LeaderboardPage from './pages/LeaderboardPage/LeaderboardPage';
import UploadPage from './pages/UploadPage/UploadPage';
import FollowingPage from './pages/FollowingPage/FollowingPage';
import UserNotFoundPage from './pages/UserNotFoundPage/UserNotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage/UnauthorizedPage';
import { ProfileProvider } from './contexts/ProfileContext';

function App() {   
  return (
    <ProfileProvider>
      <BrowserRouter>
        <Routes>
          {localStorage.getItem("access") ? (
            <>
              <Route index element={<HomePage />} />
              <Route path='/notifications' element={<NotificationsPage />} />
              <Route path='/following' element={<FollowingPage />} />
              <Route path='/edit' element={<EditPage />} />
              <Route path='/leaderboard' element={<LeaderboardPage />} />
              <Route path='/profile/:username' element={<ProfilePage />} />
              <Route path='/profile/not-found' element={<UserNotFoundPage />} />
              <Route path='/upload' element={<UploadPage />} />
              <Route path='/login' element={<Navigate to="/" replace />} />
              <Route path='/signup' element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path='/' element={<UnauthorizedPage />} /> 
              <Route path='/login' element={<LoginPage />} />
              <Route path='/signup' element={<SignUpPage />} />
              <Route path='*' element={<UnauthorizedPage />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </ProfileProvider>
  );
}

export default App;
