import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./CSS/Header.css";
import profileIcon from "../media/download.png";
import { CgProfile } from "react-icons/cg";

const Header = ({ user = null, logout = () => {} }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Debugging - log the user object
  console.log("Header user object:", user);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // Robust name extraction
  const getUserName = () => {
    if (!user) {
      console.warn("No user object available");
      return "User";
    }

    // Check all possible name sources
    const nameSource = user.displayName || user.name || user.email;
    
    if (!nameSource) {
      console.warn("User object exists but no name fields found:", user);
      return "User";
    }

    // Handle email case
    if (nameSource.includes("@")) {
      return nameSource.split("@")[0];
    }

    // Return first name if available
    return nameSource.split(" ")[0] || nameSource;
  };

  return (
    <header className="header-div">
      <Link className="logo" to="/home">UNILAG Yard</Link>

      <div className="burger" onClick={toggleMobileMenu}>
        &#9776;
      </div>

      <div className="logo-right">
        <div className="logo-btn-flex">
          <img
            src={CgProfile} alt="profile" className="google-img"
            style={{ borderRadius: "50%", width: "40px", height: "40px" }}
          />
          <Link to="/addProduct" className="logo-btn">AddProduct</Link>
        </div>
        <Link to="/allProduct" className="logo-btn-flex logo-btn">AllProduct</Link>
        {user ? (
          <div className="logo-btn-flex" onClick={toggleDropdown}>
            <img
              src={user?.photoURL || profileIcon}
              alt="profile"
              className="google-img"
              style={{ borderRadius: "50%", width: "40px", height: "40px" }}
            />
            <span className="logo-btn">Hi, {getUserName()}</span>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <h6>Profile</h6>
                <h6>Settings</h6>
                <h6 onClick={logout}>Logout</h6>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link className="logo-btn-flex" to="/login">
              <span className="logo-btn">Login</span>
            </Link>
            <Link className="logo-btn-flex1" to="/signup">
              <span className="logo-btn">Sign Up</span>
            </Link>
          </>
        )}
      </div>

      {mobileMenuOpen && (
        <div className="dropdown-menu2" onMouseLeave={toggleMobileMenu}>
          {user ? (
            <>
              <h6>Profile</h6>
              <h6>Settings</h6>
              <h6 onClick={() => { logout(); setMobileMenuOpen(false); }}>Logout</h6>
            </>
          ) : (
            <>
              <h6><Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link></h6>
              <h6><Link to="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link></h6>
            </>
          )}
        </div>
      )}
    </header>
  );
};

Header.defaultProps = {
  user: null,
  logout: () => {}
};

export default Header;