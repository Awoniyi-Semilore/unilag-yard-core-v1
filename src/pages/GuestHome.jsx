import React from 'react';
import GuestHeader from '../component/GuestHeader';
import Footer from '../component/Footer';
import '../App.css';
import Home from './Home';

const GuestHome = () => {
  return (
    <div className="app">
      <GuestHeader />
      <Home />
        
      <Footer />
    </div>
  );
};

export default GuestHome;