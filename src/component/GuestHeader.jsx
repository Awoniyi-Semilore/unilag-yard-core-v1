import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import "./CSS/Header.css";
import { Search } from "lucide-react";

const GuestHeader = ({ user = null, logout = () => {} }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownSearchQuery, setDropdownSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dropdown (for mobile)
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Handle search submission - SEPARATED from form
  const handleSearch = (query, isDropdown = false) => {
    if (query.trim()) {
      navigate(`/allProduct?search=${encodeURIComponent(query)}`);
      if (isDropdown) {
        setIsDropdownOpen(false);
        setDropdownSearchQuery('');
      }
      setSearchQuery('');
    }
  };

  // Handle Enter key in search input
  const handleKeyPress = (e, isDropdown = false) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = isDropdown ? dropdownSearchQuery : searchQuery;
      handleSearch(query, isDropdown);
    }
  };

  return (
    <motion.header 
      className='header-d'
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="logo-section">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/home" className='logo'>
            <span className='logo-text1'>Unilag</span> Yard
          </Link>
        </motion.div>
      </div>

      {/* Search Section - SEPARATED INPUT AND BUTTON */}
      {/* <div className="search-section">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search for books, gadgets, items..." 
            aria-label="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, false)}
          />
          <motion.button 
            className="search-icon-button"
            onClick={() => handleSearch(searchQuery, false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button" // Important: type="button" to prevent form submission
          >
            <Search size={20} className="search-icon" />
          </motion.button>
        </div>
      </div> */}
      
      <div className="auth-section">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/signUp" className='sign-btn'>Login / Sign Up</Link>
        </motion.div>
      </div>

      {/* Burger Menu */}
      <div className="burger-menu" ref={dropdownRef}>
        <motion.button 
          className="burger-button"
          onClick={toggleDropdown}
          aria-label="Toggle menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button" // Important: type="button"
        >
          <span className="burger-icon">☰</span>
        </motion.button>
        
        {/* Dropdown Content */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div 
              className="burger-dropdown"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="dropdown-search">
                {/* <div className="dropdown-search-bar">
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    aria-label="Search products"
                    value={dropdownSearchQuery}
                    onChange={(e) => setDropdownSearchQuery(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, true)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <motion.button 
                    className="search-icon-button"
                    onClick={() => handleSearch(dropdownSearchQuery, true)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button" // Important: type="button"
                  >
                    <Search size={18} className="search-icon" />
                  </motion.button>
                </div> */}
              </div>
              
              <div className="dropdown-auth">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/signUp" 
                    className='dropdown-sign-btn'
                    onClick={handleCloseDropdown}
                  >
                    Login / Sign Up
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export default GuestHeader;