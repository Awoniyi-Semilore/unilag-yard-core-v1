import React from 'react';
import './PlanHero.css' 
import { Link } from 'react-router-dom';

const PlanHero = () => {
  return (
    <section className="plan-hero">
      {/* Combined Background Effects */}
      <div className="gradient-bg"></div>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
      
      {/* Your Text Content */}
      <div className="hero-content">
        <h1>Turn Your Campus Clutter into Cash.</h1>
        <p>Why let your skills and old items go to waste? Monetize them safely within campus, fund your next adventure, and connect with the UNILAG community.</p>
        <Link to='howItWorks' className='Btn-1'>See How it Works</Link>
      </div>
    </section>
  );
};

export default PlanHero;