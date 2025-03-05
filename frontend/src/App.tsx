import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';

function App() { 
  return (
    <BrowserRouter>
    <Routes>
      <Route index element={<HomePage/>} />
      <Route path='/login' element={<LoginPage />}/>
      <Route path='/signup' element={<SignUpPage />}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App
