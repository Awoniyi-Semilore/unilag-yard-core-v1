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
                    />
                    <motion.button 
                      className="search-icon-button"
                      onClick={() => handleSearch(dropdownSearchQuery, true)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                    >
                      <Search size={18} className="search-icon" />
                    </motion.button>
                  </div>
                </div>

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














// import React, { useState } from 'react'
// import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
// import "./CSS/Header.css";
// import { Heart, MessageCircle, ClipboardList, Bell, User, Search, PlusCircle } from "lucide-react";
//   // In your Header component, add:
// import { useTheme } from '../context/ThemeContext';
// import { Moon, Sun } from 'lucide-react';

// const Header = ({ user = null, logout = () => {} }) => {
//   const [isHovered, setIsHovered] = useState(null);
//   const [activeIcon, setActiveIcon] = useState(null);
//   const navigate = useNavigate(); // Added for navigation

//   const handleIconClick = (index, id) => {
//     // If clicking the same icon again, close it
//     if (activeIcon === index) {
//       setActiveIcon(null);
//     } else {
//       setActiveIcon(index);
//     }

//     // Handle navigation for specific icons
//     if (id === 'saved') {
//       navigate('/saved-products');
//     }
//     // Add navigation for other icons as needed
//     // if (id === 'messages') {
//     //   navigate('/messages');
//     // }
//     // if (id === 'my-advert') {
//     //   navigate('/my-adverts');
//     // }
//   };

//   const iconData = [
//     { 
//       icon: Heart, 
//       label: "Saved Items", 
//       id: "saved", 
//       className: "heart-icon",
//       path: "/saved-products" // Added path for navigation
//     },
//     { 
//       icon: MessageCircle, 
//       label: "Messages", 
//       id: "messages", 
//       className: "message-icon",
//       path: "/messages" // You can add paths for other icons too
//     },
//     { 
//       icon: ClipboardList, 
//       label: "My Adverts", 
//       id: "my-advert", 
//       className: "advert-icon",
//       path: "/my-adverts"
//     },
//     { 
//       icon: Bell, 
//       label: "Notifications", 
//       id: "notification", 
//       className: "bell-icon",
//       path: "/notifications"
//     },
//     { 
//       icon: User, 
//       label: "My Profile", 
//       id: "my-profile", 
//       className: "profile-icon",
//       path: "/profile"
//     }
//   ];



// // Inside your Header component:
// const { isDarkMode, toggleTheme } = useTheme();
//   const handleHovered = (index) => {
//     setIsHovered(index);
//   };
//   const handleNotHovered = () => {
//     setIsHovered(null);
//   };

//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const handleMouseEnter = () => {
//     setIsDropdownOpen(true);
//   };

//   const handleMouseLeave = () => {
//     setIsDropdownOpen(false);
//   };

//   const handleCloseDropdown = () => {
//     setIsDropdownOpen(false);
//   };

//   // Function to handle icon click in dropdown
//   const handleDropdownIconClick = (index, id, path) => {
//     setActiveIcon(index);
//     if (path) {
//       navigate(path);
//       setIsDropdownOpen(false); // Close dropdown after navigation
//     }
//   };

//   return (
//     <header className='header-d'>
//         <div className="logo-section">
//           <Link to="/home" className='logo'>
//             <span className='logo-text1'>Unilag</span> Yard
//           </Link>
//         </div>
        
//         <div className="search-section">
//           <form className="search-bar" role="search">
//             <input 
//               type="text" 
//               placeholder="Search for books, gadgets, items..." 
//               aria-label="Search products"
//             />
//             <Search size={20} className="search-icon" />
//           </form>
//         </div>
        
//         <div className="nav-icons">
//           {/* Map through iconData array */}
//           {iconData.map((item, index) => {
//             const IconComponent = item.icon;
//             return (
//               <div key={item.id} className="icon-container">
//                 {/* Make the icon clickable */}
//                 <div 
//                   className="icon-clickable"
//                   onClick={() => handleIconClick(index, item.id)}
//                 >
//                   <IconComponent
//                     size={24} 
//                     className={`icon-hover ${item.className}`}
//                     onMouseEnter={() => handleHovered(index)}
//                     onMouseLeave={handleNotHovered}
//                   />
//                 </div>
//                 {/* Show label for hovered OR clicked icon */}
//                 {(isHovered === index || activeIcon === index) && (
//                   <div className="icon-label">
//                     {item.label}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//           // Add to your icons or navigation:
// <IconButton
//   aria-label="Toggle theme"
//   icon={isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//   onClick={toggleTheme}
//   variant="ghost"
//   color={isDarkMode ? "yellow.400" : "gray.600"}
// />
          
//           <button className='product-btn'>
//             <Link to="/addProduct" className='product-btn'>
//               <PlusCircle size={20} className="btn-icon" />
//               <span>Add Product</span>
//             </Link>
//           </button>
//         </div>

//         {/* Burger Menu */}
//         <div 
//           className="burger-menu1" 
//           onMouseEnter={handleMouseEnter}
//           onClick={(e) => {e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen);}}
//           onMouseLeave={handleMouseLeave}
//         >
//           <span className="burger-icon">☰</span>
          
//           {/* Dropdown Content */}
//           {isDropdownOpen && (
//             <div className="burger-dropdown">
//               <div className='burger-top'>
//                 <div className="dropdown-search">
//                   <form className="dropdown-search-bar" role="search">
//                     <input 
//                       type="text" 
//                       placeholder="Search..." 
//                       aria-label="Search products"
//                     />
//                     <Search size={18} className="search-icon" />
//                   </form>
//                 </div>

//                 <div className='cancel' onClick={handleCloseDropdown}>x</div>
//               </div>
//               <div className='nav-container'>
//                 <div className="nav-iconss">
//                   {/* Map through iconData array for dropdown */}
//                   {iconData.map((item, index) => {
//                     const IconComponent = item.icon;
//                     return (
//                       <div key={item.id} className="icon-container">
//                         {/* Make dropdown icons clickable with navigation */}
//                         <div 
//                           className="icon-clickable"
//                           onClick={() => handleDropdownIconClick(index, item.id, item.path)}
//                         >
//                           <IconComponent
//                             size={24} 
//                             className={`icon-hover ${item.className}`}
//                             onMouseEnter={() => handleHovered(index)}
//                             onMouseLeave={handleNotHovered}
//                           />
//                         </div>
//                         {activeIcon === index && (
//                           <div className="icon-label">
//                             {item.label}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//                 <button className='product-btn1'>
//                   <Link to="/addProduct" className='product-btn1' onClick={() => setIsDropdownOpen(false)}>
//                     <PlusCircle size={20} className="btn-icon" />
//                     <span>Add Product</span>
//                   </Link>
//                 </button>
//               </div>  
//             </div>
//           )}
//         </div>
//     </header>
//   )
// }

// Header.defaultProps = {
//   user: null,
//   logout: () => {}
// };

// export default Header;