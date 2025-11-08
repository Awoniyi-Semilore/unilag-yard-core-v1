import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import "./CSS/Header.css";
import { Heart, MessageCircle, ClipboardList, Bell, User, Search, PlusCircle } from "lucide-react";

const Header = ({ user = null, logout = () => {} }) => {
  const [isHovered, setIsHovered] = useState(null);
  const [activeIcon, setActiveIcon] = useState(null);
  const navigate = useNavigate(); // Added for navigation

  const handleIconClick = (index, id) => {
    // If clicking the same icon again, close it
    if (activeIcon === index) {
      setActiveIcon(null);
    } else {
      setActiveIcon(index);
    }

    // Handle navigation for specific icons
    if (id === 'saved') {
      navigate('/saved-products');
    }
    // Add navigation for other icons as needed
    // if (id === 'messages') {
    //   navigate('/messages');
    // }
    // if (id === 'my-advert') {
    //   navigate('/my-adverts');
    // }
  };

  const iconData = [
    { 
      icon: Heart, 
      label: "Saved Items", 
      id: "saved", 
      className: "heart-icon",
      path: "/saved-products" // Added path for navigation
    },
    { 
      icon: MessageCircle, 
      label: "Messages", 
      id: "messages", 
      className: "message-icon",
      path: "/messages" // You can add paths for other icons too
    },
    { 
      icon: ClipboardList, 
      label: "My Adverts", 
      id: "my-advert", 
      className: "advert-icon",
      path: "/my-adverts"
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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Function to handle icon click in dropdown
  const handleDropdownIconClick = (index, id, path) => {
    setActiveIcon(index);
    if (path) {
      navigate(path);
      setIsDropdownOpen(false); // Close dropdown after navigation
    }
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
        
        <div className="nav-icons">
          {/* Map through iconData array */}
          {iconData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={item.id} className="icon-container">
                {/* Make the icon clickable */}
                <div 
                  className="icon-clickable"
                  onClick={() => handleIconClick(index, item.id)}
                >
                  <IconComponent
                    size={24} 
                    className={`icon-hover ${item.className}`}
                    onMouseEnter={() => handleHovered(index)}
                    onMouseLeave={handleNotHovered}
                  />
                </div>
                {/* Show label for hovered OR clicked icon */}
                {(isHovered === index || activeIcon === index) && (
                  <div className="icon-label">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
          
          <button className='product-btn'>
            <Link to="/addProduct" className='product-btn'>
              <PlusCircle size={20} className="btn-icon" />
              <span>Add Product</span>
            </Link>
          </button>
        </div>

        {/* Burger Menu */}
        <div 
          className="burger-menu1" 
          onMouseEnter={handleMouseEnter}
          onClick={(e) => {e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen);}}
          onMouseLeave={handleMouseLeave}
        >
          <span className="burger-icon">☰</span>
          
          {/* Dropdown Content */}
          {isDropdownOpen && (
            <div className="burger-dropdown">
              <div className='burger-top'>
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

                <div className='cancel' onClick={handleCloseDropdown}>x</div>
              </div>
              <div className='nav-container'>
                <div className="nav-iconss">
                  {/* Map through iconData array for dropdown */}
                  {iconData.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={item.id} className="icon-container">
                        {/* Make dropdown icons clickable with navigation */}
                        <div 
                          className="icon-clickable"
                          onClick={() => handleDropdownIconClick(index, item.id, item.path)}
                        >
                          <IconComponent
                            size={24} 
                            className={`icon-hover ${item.className}`}
                            onMouseEnter={() => handleHovered(index)}
                            onMouseLeave={handleNotHovered}
                          />
                        </div>
                        {activeIcon === index && (
                          <div className="icon-label">
                            {item.label}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button className='product-btn1'>
                  <Link to="/addProduct" className='product-btn1' onClick={() => setIsDropdownOpen(false)}>
                    <PlusCircle size={20} className="btn-icon" />
                    <span>Add Product</span>
                  </Link>
                </button>
              </div>  
            </div>
          )}
        </div>
    </header>
  )
}

Header.defaultProps = {
  user: null,
  logout: () => {}
};

export default Header;