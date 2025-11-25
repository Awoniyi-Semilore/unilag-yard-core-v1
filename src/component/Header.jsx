import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import "./CSS/Header.css";
import { Heart, MessageCircle, ClipboardList, Bell, User, Search, PlusCircle } from "lucide-react";

const Header = ({ user = null, logout = () => {} }) => {
  const [isHovered, setIsHovered] = useState(null);
  const [activeIcon, setActiveIcon] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownSearchQuery, setDropdownSearchQuery] = useState('');

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
      path: "/saved-products"
    },
    { 
      icon: MessageCircle, 
      label: "Messages", 
      id: "messages", 
      className: "message-icon",
      path: "/messages"
    },
    // { 
    //   icon: ClipboardList, 
    //   label: "My Adverts", 
    //   id: "my-advert", 
    //   className: "advert-icon",
    //   path: "/my-adverts"
    // },
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
      path: "/my-profile"
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

      {/* Fixed Search Section - NO FORM */}
      <div className="search-section">
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
            type="button"
          >
            <Search size={20} className="search-icon" />
          </motion.button>
        </div>
      </div>

      <div className="nav-icons">
        {/* Map through other icons */}
     