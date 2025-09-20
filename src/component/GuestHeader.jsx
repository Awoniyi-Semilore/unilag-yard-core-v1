import React, { useState } from 'react'
import { Link } from "react-router-dom";
import "./CSS/Header.css";
import { Search } from "lucide-react";

const GuestHeader = ({ user = null, logout = () => {} }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
    <header className='header-d'>
      <div className="logo-section">
        <Link to="/home" className='logo'>
          <span className='logo-text1'>Unilag</span> Yard
        </Link>
      </div>

      <div className="search-section">
        <form className="search-bar" role="search">
          <input 
            type="text" 
            placeholder="Search for books, gadgets, items..." 
            aria-label="Search products"
          />
          <Search size={20} className="search-icon" />
        </form>
      </div>
      
      <div className="auth-section">
        <Link to="/signUp" className='sign-btn'>Login / Sign Up</Link>
      </div>

      {/* Burger Menu */}
      <div 
        className="burger-menu" 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className="burger-icon">☰</span>
        
        {/* Dropdown Content */}
        {isDropdownOpen && (
          <div className="burger-dropdown">
            <div className="dropdown-search">
              <form className="dropdown-search-bar" role="search">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  aria-label="Search products"
                />
                <Search size={18} className="search-icon" />
              </form>
            </div>
            
            <div className="dropdown-auth">
              <Link to="/signUp" className='dropdown-sign-btn'>Login / Sign Up</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default GuestHeader;