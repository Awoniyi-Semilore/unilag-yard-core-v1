import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import "./CSS/Header.css";
import { 
  Heart, 
  MessageCircle, 
  Bell, 
  User, 
  Search, 
  PlusCircle, 
  Moon, 
  Sun 
} from "lucide-react";

const Header = ({ user = null, logout = () => {} }) => {
  const [isHovered, setIsHovered] = useState(null);
  const [activeIcon, setActiveIcon] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownSearchQuery, setDropdownSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  // Dark mode functionality
  useEffect(() => {
    const savedTheme = localStorage.getItem('unilag-yard-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    setIsDarkMode(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (dark) => {
    const theme = dark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('unilag-yard-theme', theme);
  };

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    applyTheme(newTheme);
    
    // Haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleIconClick = (index, id, path) => {
    if (activeIcon === index) {
      setActiveIcon(null);
    } else {
      setActiveIcon(index);
    }

    if (path) {
      navigate(path);
    }
  };

  const iconData = [
    { 
      icon: Heart, 
      label: "Saved Items", 
      id: "saved", 
      className: "heart-icon",
      path: "/saved"
    },
    { 
      icon: MessageCircle, 
      label: "Messages", 
      id: "messages", 
      className: "message-icon",
      path: "/messages"
    },
    { 
      icon: Bell, 
      label: "Notifications", 
      id: "notification", 
      className: "bell-icon",
      path: "/notifications"
    },
    { 
      icon: User, 
      label: "My Profile", 
      id: "my-profile", 
      className: "profile-icon",
      path: "/profile"
    }
  ];

  const handleHovered = (index) => {
    setIsHovered(index);
  };

  const handleNotHovered = () => {
    setIsHovered(null);
  };

  // Toggle dropdown (for mobile)
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Handle search submission
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

  // Animation variants
  const dropdownVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const iconLabelVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
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

      {/* Search Section */}
      <div className="search-section">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search for books, gadgets, items..." 
            aria-label="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, false)}
            className="search-input"
          />
          <motion.button 
            className="search-icon-button"
            onClick={() => handleSearch(searchQuery, false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            aria-label="Search"
          >
            <Search size={20} className="search-icon" />
          </motion.button>
        </div>
      </div>

      <div className="nav-icons">
        {/* Dark Mode Toggle */}
        <motion.div 
          className="icon-container theme-toggle-container"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div 
            className="icon-clickable theme-toggle-btn"
            onClick={toggleDarkMode}
            onMouseEnter={() => handleHovered('theme')}
            onMouseLeave={handleNotHovered}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun size={24} className="icon-hover theme-icon" />
            ) : (
              <Moon size={24} className="icon-hover theme-icon" />
            )}
          </div>
          <AnimatePresence>
            {(isHovered === 'theme') && (
              <motion.div 
                className="icon-label"
                variants={iconLabelVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.2 }}
              >
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Map through other icons */}
        {iconData.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <motion.div 
              key={item.id} 
              className="icon-container"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div 
                className="icon-clickable"
                onClick={() => handleIconClick(index, item.id, item.path)}
                onMouseEnter={() => handleHovered(index)}
                onMouseLeave={handleNotHovered}
              >
                <IconComponent
                  size={24} 
                  className={`icon-hover ${item.className}`}
                />
              </div>
              <AnimatePresence>
                {(isHovered === index || activeIcon === index) && (
                  <motion.div 
                    className="icon-label"
                    variants={iconLabelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        <motion.button 
          className='product-btn'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/addProduct" className='product-btn-link'>
            <PlusCircle size={20} className="btn-icon" />
            <span>Add Product</span>
          </Link>
        </motion.button>
      </div>

      {/* Burger Menu */}
      <div className="burger-menu1" ref={dropdownRef}>
        <motion.button 
          className="burger-button"
          onClick={toggleDropdown}
          aria-label="Toggle menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
        >
          <span className="burger-icon">☰</span>
        </motion.button>

        {/* Dropdown Content */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div 
              className="burger-dropdown"
              variants={dropdownVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className='burger-top'>
                <div className="dropdown-search">
                  <div className="dropdown-search-bar">
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      aria-label="Search products"
                      value={dropdownSearchQuery}
                      onChange={(e) => setDropdownSearchQuery(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, true)}
                      onClick={(e) => e.stopPropagation()}
                      className="search-input"
                    />
                    <motion.button 
                      className="search-icon-button"
                      onClick={() => handleSearch(dropdownSearchQuery, true)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      aria-label="Search"
                    >
                      <Search size={18} className="search-icon" />
                    </motion.button>
                  </div>
                </div>

                {/* Dark Mode Toggle in Dropdown */}
                <motion.button 
                  className="theme-toggle-dropdown"
                  onClick={toggleDarkMode}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? (
                    <Sun size={20} className="theme-icon" />
                  ) : (
                    <Moon size={20} className="theme-icon" />
                  )}
                </motion.button>

                <motion.button 
                  className='cancel' 
                  onClick={handleCloseDropdown} 
                  aria-label="Close menu"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                >
                  ×
                </motion.button>
              </div>
              
              <div className='nav-container' onClick={(e) => e.stopPropagation()}>
                <div className="nav-iconss">
                  {iconData.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={item.id} className="icon-container">
                        <div 
                          className="icon-clickable"
                          onClick={() => {
                            handleIconClick(index, item.id, item.path);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <IconComponent
                            size={24} 
                            className={`icon-hover ${item.className}`}
                          />
                        </div>
                        <span className="dropdown-icon-label">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
                <motion.button 
                  className='product-btn1'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/addProduct" 
                    className='product-btn1-link' 
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <PlusCircle size={20} className="btn-icon" />
                    <span>Add Product</span>
                  </Link>
                </motion.button>
              </div>  
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

Header.defaultProps = {
  user: null,
  logout: () => {}
};

export default Header;