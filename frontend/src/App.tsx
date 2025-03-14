import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import NotificationsPage from './pages/NotificationsPage/NotificationsPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import FriendsPage from './pages/FriendsPage/FriendsPage';
import EditPage from './pages/EditPage/EditPage';
import LeaderboardPage from './pages/LeaderboardPage/LeaderboardPage';

function App() { 
  return (
    <BrowserRouter>
    <Routes>
      <Route index element={<HomePage/>} />
      <Route path='/notifications' element={<NotificationsPage/>} />
      <Route path='/friends' element={<FriendsPage/>} />
      <Route path='/edit' element={<EditPage/>} />
      <Route path='/leaderboard' element={<LeaderboardPage/>} />
      <Route path='/profile' element={<ProfilePage/>} />
      <Route path='/login' element={<LoginPage />}/>
      <Route path='/signup' element={<SignUpPage />}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App
