import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./CSS/Header.css";

const GuestHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="header-div">
      <Link className="logo" to="/guest-home">UNILAG Yard</Link>

      <div className="burger" onClick={toggleMobileMenu}>
        &#9776;
      </div>

      <div className="logo-right">
        <Link className="logo-btn-flex" to="/login">
          <span className="logo-btn">Login</span>
        </Link>
        <Link className="logo-btn-flex1" to="/signup">
          <span className="logo-btn">Sign Up</span>
        </Link>
      </div>

      {mobileMenuOpen && (
        <div className="dropdown-menu2" onMouseLeave={toggleMobileMenu}>
          <h6><Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link></h6>
          <h6><Link to="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link></h6>
        </div>
      )}
    </header>
  );
};

export default GuestHeader;