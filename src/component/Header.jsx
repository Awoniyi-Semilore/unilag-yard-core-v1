import React, { useState } from 'react'
import { Link } from "react-router-dom";
import "./CSS/Header.css";
import { Heart, MessageCircle, ClipboardList, Bell, User, Search, PlusCircle } from "lucide-react";

const Header = ({ user = null, logout = () => {} }) => {
  const [isHovered, setIsHovered] = useState(null);
  const [activeIcon, setActiveIcon] = useState(null); // ← Add this

  const handleIconClick = (index) => {
    // If clicking the same icon again, close it
    if (activeIcon === index) {
      setActiveIcon(null);
    } else {
      setActiveIcon(index); // Otherwise, open this icon
    }
  };

 const iconData = [
    { icon: Heart, label: "Saved Items", id: "saved" , className: "heart-icon"},
    { icon: MessageCircle, label: "Messages", id: "messages" , className: "message-icon" },
    { icon: ClipboardList, label: "My Adverts", id: "my-advert" , className: "advert-icon" },
    { icon: Bell, label: "Notifications", id: "notification" , className: "bell-icon" },
    { icon: User, label: "My Profile", id: "my-profile" , className: "profile-icon" }
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

  return (
    <header className='header-d'>
        <div className="logo-section">
          <Link to="/home" className='logo'>
            <span className='logo-text1'>Unilag</span> Yard
            </Link> {/* Added to prop */}
        </div>
        
        <div className="search-section">
          <form className="search-bar" role="search">
            {/* Input field */}
            <input 
              type="text" 
              placeholder="Search for books, gadgets, items..." 
              aria-label="Search products"
            />
            {/* Search icon - placed after the input but inside the same form */}
            <Search size={20} className="search-icon" />
          </form>
        </div>
        
        <div className="nav-icons">
          {/* Map through iconData array */}
          {iconData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={item.id} className="icon-container">
                <IconComponent
                  size={24} 
                  className={`icon-hover ${item.className}`}
                  onMouseEnter={() => handleHovered(index)}
                  onMouseLeave={handleNotHovered}
                  onClick={() => handleIconClick(index)}
                />
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
                  {/* Map through iconData array */}
                  {iconData.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={item.id} className="icon-container">
                        <IconComponent
                          size={24} 
                          className={`icon-hover ${item.className}`}
                          onMouseEnter={() => handleHovered(index)}
                          onClick={() => handleIconClick(index)}
                          onMouseLeave={handleNotHovered}
                        />
                        {activeIcon === index && ( // ← ONLY check activeIcon
                        <div className="icon-label">
                          {item.label}
                        </div>
                      )}
                      </div>
                    );
                  })}
                  
                </div>
                  <button className='product-btn1'>
                    <Link to="/addProduct" className='product-btn1'>
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

export default Header



// import React from 'react'
// import { Link } from "react-router-dom";
// import "./CSS/Header.css";
// import { Heart, MessageCircle, ClipboardList, Bell, User, Search, PlusCircle } from "lucide-react";


// const Header = ({ user = null, logout = () => {} }) => {

//   return (
//     <header className='header-div'>
//       <div>
//         <div><Link className='logo'>Unilag Yard</Link></div>
//         <div>
//           <form class="search-bar" role="search">
//             <input type="text" placeholder="Search for books, gadgets, items..." 
//             < Search size={24} color="#4e5d6c" className="icon-hover" /> />
//             <button type="submit" aria-label="Submit search"></button>
//           </form>
//         </div>
//         <div>
//           <Heart size={24} color="#4e5d6c" className="icon-hover" />      
//           <MessageCircle size={24} color="#4e5d6c" className="icon-hover" /> 
//           <ClipboardList size={24} color="#4e5d6c" className="icon-hover" /> 
//           <Bell size={24} color="#4e5d6c" className="icon-hover" />       
//           <User size={24} color="#4e5d6c" className="icon-hover" />
//           <button className='product-btn'>
//             <PlusCircle size={24} color="#4e5d6c" className="icon-hover" />
//             Add Product
//           </button>
//         </div>
//       </div>
//     </header>
//   )
// }

// Header.defaultProps = {
//   user: null,
//   logout: () => {}
// };

// export default Header
