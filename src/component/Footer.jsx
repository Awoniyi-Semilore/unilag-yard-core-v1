import React from 'react'
import './CSS/Footer.css'
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube, FaLinkedinIn } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className='footer-container'>
      <div className='footer-top'>

        <div className='footer1'>
          <h4> <span style={{color: '#2e7d32'}}>Unilag</span> Yard</h4>
          <h2>The Official Marketplace <br />for UNILAG Students</h2>
          <h2>A safe, secure platform for <br />students to buy and sell</h2>
        </div>

        <div className='footer2'>
            <h3>Quick Links</h3>
            <Link to='/home' className='footer-link'>Home</Link>
            <Link to='/addProduct' className='footer-link'>Add Product</Link>
            <Link to='/how-it-works' className='footer-link'>How it works</Link>
            <Link to='/contact' className='footer-link'>Contact Us</Link>
            {/* <Link to='/aboutUs' className='footer-link'>About Us</Link> */}
        </div>

        <div className='footer2'>
          <h3>HELP & SUPPORT</h3>
          <Link to='/safety-tips' className='footer-link'>Safety Tips</Link>
          <Link to='/faq-page' className='footer-link'>FAQs</Link>
          <Link to='/termsAndCondition' className='footer-link'>Terms of Service</Link>
          <Link to='/privacy-policy' className='footer-link'>Privacy Policy</Link>
        </div>

        <div className='footer2'>
          <h3>STAY CONNECTED</h3>
          <div className="social-icons">
            <a href="https://facebook.com/yourpage" aria-label="Facebook">
              <FaFacebookF size={32} className="social-icon" />
            </a>
            <a href="https://twitter.com/yourhandle" aria-label="Twitter">
              <FaTwitter size={32} className="social-icon" />
            </a>
            <a href="https://instagram.com/yourhandle" aria-label="Instagram">
              <FaInstagram size={32} className="social-icon" />
            </a>
            <a href="https://youtube.com/yourchannel" aria-label="YouTube">
              <FaYoutube size={32} className="social-icon" />
            </a>
            <a href="https://linkedin.com/company/yourpage" aria-label="LinkedIn">
              <FaLinkedinIn size={32} className="social-icon" />
            </a>
          </div>
        </div>
      </div>
      <div className='footer-bottom'>
        <h5>Copyright © 2025 Unilag Yard. All rights reserved. For UNILAG Students, by UNILAG Students</h5>
      </div>
    </div>
  )
}

export default Footer
