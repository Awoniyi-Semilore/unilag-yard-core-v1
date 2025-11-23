import React from 'react';
import { useNavigate } from 'react-router-dom'; // ADDED: Proper navigation
import '../component/CSS/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate(); // ADDED: React Router navigation

  const handleGuest = () => {
    navigate('/guest-home'); // FIXED: Use navigate instead of window.location
  };

  const handleLoginSignup = () => {
    navigate('/login'); // ADDED: Proper navigation
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="welcome-text">
          Welcome to <span className="campus-name">UNILAG Yard</span>
          <div className="underline-animation"></div>
        </h1>
        <p className="subtitle">
          Nigeria's premier student marketplace. Buy, sell, and connect with campus ease.
        </p>
        <div className="cta-buttons">
          <button className="cta-button guest-mode" onClick={handleGuest}>
            Browse as Guest
          </button>
          <button className="cta-button login-signup" onClick={handleLoginSignup}>
            Login / Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;