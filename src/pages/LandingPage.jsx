import React from 'react';
import '../App.css';
import '../component/CSS/LandingPage.css';

const LandingPage = () => {
  const handleGuest = () => {
    window.location.href = "/guest-home";
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
          <a href="/login" className="cta-button login-signup">
            Login / Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;