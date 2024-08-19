import React from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import About from './About';
import './App.css';
import Home from './home';
import Login from './Login';
import Navbar from './Navbar';
import TerminatorPage from './TerminatorPage';
import VideoBackground from './VideoBackground';

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/terminator';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<VideoBackground />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/terminator" element={<TerminatorPage />} />
        {/* Add other routes as needed */}
      </Routes>
    </>
  );
}

export default App;
