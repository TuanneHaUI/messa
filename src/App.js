// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // <<< IMPORT
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfilePage from './pages/ProfilePage';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<RegisterPage />} /> {/* <<< THÊM ROUTE NÀY */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/messages" element={<ChatPage />} />
          <Route path="/profile" element={<ProfilePage />} /> {/* <<< THÊM ROUTE NÀY */}
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;