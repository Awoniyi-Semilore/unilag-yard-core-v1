import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import '../component/CSS/Home.css';
import homePageImage from "../media/homePageImage.jpg";
import { 
  BookOpen, Smartphone, BedDouble, Shirt, Ticket, Gift, 
  ChevronRight, Shield, CheckCircle, Settings, Flame, X,
  MapPin, MessageCircle, Search, Sparkles, Star, Crown,
  Eye, Heart, Calendar, CheckCircle2, Clock
} from "lucide-react";
import { useProducts } from '../Hooks/useFirestore';
import { useAuth } from '../Hooks/useAuth.jsx';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [displayMode, setDisplayMode] = useState('featured');
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Use the Firebase products hook
  const { products, loading, error, refetch } = useProducts({ 
    status: 'active'
  });

  // Refs for scroll animations
  const featuredRef = useRef(null);
  const categoriesRef = useRef(null);
  const safetyRef = useRef(null);
  const isFeaturedInView = useInView(featuredRef, { once: false, threshold: 0.1 });
  const isCategoriesInView = useInView(categoriesRef, { once: false, threshold: 0.1 });
  const isSafetyInView = useInView(safetyRef, { once: false, threshold: 0.1 });

  // Sample subcategories data
  const subcategories = {
    "Textbooks & Academic": ["Core Course Textbooks", "Recommended Reads", "Study Guides", "Stationery"],
    "Electronics & Gadgets": ["Phones & Smartphones", "Laptops & Computers", "Tablets", "Headphones"],
    "Hostel & Room Essentials": ["Mattresses & Beddings", "Fans & Cooling", "Cooking Appliances"],
    "Fashion & Clothing": ["Casual Wear", "Formal Wear", "Shoes & Footwear", "UNILAG Merchandise"],
    "Services": ["Photocopy & Printing", "Typing & Project Work", "Hair Styling"],
    "Tickets & Events": ["Concert Tickets", "Event Wristbands", "Workshop Passes"],
    "Free Stuff": ["Giveaways", "Old Notes", "Other Free Items"]
  };

  // Icon mapping
  const categoryIcons = {
    "Textbooks & Academic": <BookOpen size={20} color="#2e7d32" />,
    "Electronics & Gadgets": <Smartphone size={20} color="#1565c0" />,
    "Hostel & Room Essentials": <BedDouble size={20} color="#7b1fa2" />,
    "Fashion & Clothing": <Shirt size={20} color="#d32f2f" />,
    "Services": <Settings size={20} color="#f57c00" />,
    "Tickets & Events": <Ticket size={20} color="#00838f" />,
    "Free Stuff": <Gift size={20} color="#388e3c" />
  };

  // Get display products with ALWAYS priority for featured/premium
  const getDisplayProducts = () => {
    if (!products || products.length === 0) return [];

    let filteredProducts = [...products];

    // Filter by category if selected
    if (selectedCategory && displayMode === 'products') {
      filteredProducts = filteredProducts.filter(product => 
        product.category === selectedCategory
      );
    }

    // Filter by subcategory if selected
    if (selectedSubcategory && displayMode === 'products') {
      filteredProducts = filteredProducts.filter(product => 
        product.subcategory === selectedSubcategory
      );
    }

    // ALWAYS sort by priority: Premium + Featured first, then by creation date (newest first)
    filteredProducts.sort((a, b) => {
      // Premium + Featured (highest priority)
      const aPremiumFeatured = (a.premium && a.featured);
      const bPremiumFeatured = (b.premium && b.featured);
      if (aPremiumFeatured && !bPremiumFeatured) return -1;
      if (!aPremiumFeatured && bPremiumFeatured) return 1;
      
      // Premium only (second priority)
      if (a.premium && !b.premium) return -1;
      if (!a.premium && b.premium) return 1;
      
      // Featured only (third priority)
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      // Then by creation date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return filteredProducts;
  };

  const displayProducts = getDisplayProducts();

  // Get seller verification status badge
  const getVerificationBadge = (sellerVerificationStatus) => {
    switch (sellerVerificationStatus) {
      case 'verified':
        return { text: 'Verified Seller', color: '#2e7d32', bgColor: '#e8f5e9', icon: <CheckCircle2 size={12} /> };
      case 'pending':
        return { text: 'Verification Pending', color: '#f57c00', bgColor: '#fff3e0', icon: <Clock size={12} /> };
      case 'unverified':
      default:
        return { text: 'Unverified Seller', color: '#666666', bgColor: '#f5f5f5', icon: <Shield size={12} /> };
    }
  };

  // Format date to relative time
  const formatDate = (date) => {
    const now = new Date();
    const productDate = new Date(date);
    const diffTime = Math.abs(now - productDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return productDate.toLocaleDateString();
  };

  const handleCategoryClick = (categoryName) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
      setDisplayMode('featured');
    } else {
      setSelectedCategory(categoryName);
      setDisplayMode('subcategories');
    }
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setDisplayMode('products');
  };

  const handleShowFeatured = () => {
    setDisplayMode('featured');
    setSelectedSubcategory(null);
    setSelectedCategory(null);
  };

  const closeSubcategories = () => {
    setSelectedCategory(null);
    setDisplayMode('featured');
  };

  // Mobile categories functions
  const openMobileCategories = () => {
    setShowMobileCategories(true);
  };

  const closeMobileCategories = () => {
    setShowMobileCategories(false);
    setExpandedCategory(null);
  };

  const handleMobileCategoryClick = (categoryName) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  const handleMobileSubcategoryClick = (subcategory) => {
    const category = Object.keys(subcategories).find(cat => 
      subcategories[cat].includes(subcategory)
    );
    setSelectedCategory(category);
    handleSubcategoryClick(subcategory);
    closeMobileCategories();
  };

  const handleMobileFeaturedClick = () => {
    handleShowFeatured();
    closeMobileCategories();
  };

  // Navigation handlers
  const handleStartSelling = () => {
    navigate('/addProduct');
  };

  const handleSafetyGuide = () => {
    navigate('/safety-tips');
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Scroll animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className='home'>
      
      {/* Top Section */}
      <div className='homeTop'>
        <motion.div 
          className='homeTopLeft'
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        >
          <motion.h5
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            The Official Marketplace for UNILAG Students.
          </motion.h5>
          
          <motion.h3
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.0 }}
          >
            Your trusted community to find deals, sell textbooks, and connect with campus mates. 100% verified students.
          </motion.h3>
          
          <motion.div 
            className='homeTopBtns'
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <motion.button 
              className='homeTopBtns2' 
              onClick={handleStartSelling}
              whileHover={{ 
                scale: 1.1,
                backgroundColor: "#2e7d32",
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.9 }}
            >
              Start Selling
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div 
          className='homeTopRight'
          initial={{ opacity: 0, x: 100, y: 100, rotate: 5 }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        >
          <motion.img 
            src={homePageImage} 
            alt="A Lady showing something on her phone to her friend"
            whileHover={{ 
              scale: 1.05,
              rotate: -1,
              transition: { duration: 0.4 }
            }}
          />
        </motion.div>
      </div>

      {/* Mobile Categories Button */}
      <motion.button 
        className="mobile-categories-btn"
        onClick={openMobileCategories}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.8, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1, backgroundColor: "#f0f0f0" }}
        whileTap={{ scale: 0.9 }}
      >
        <Settings size={20} />
        Browse Categories
      </motion.button>

      {/* Mobile Categories Backdrop */}
      {showMobileCategories && (
        <motion.div 
          className="categories-backdrop active"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeMobileCategories}
        >
          <motion.div 
            className="categories-panel active"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button 
              className="close-panel" 
              onClick={closeMobileCategories}
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.8 }}
            >
              ×
            </motion.button>
            <motion.h4
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Browse Categories
            </motion.h4>
            
            <div className="mobile-categories">
              <motion.div 
                className="mobile-category featured" 
                onClick={handleMobileFeaturedClick}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ x: 10, backgroundColor: 'rgba(255, 107, 53, 0.2)' }}
              >
                <Flame size={20} color="#ff6b35" />
                <span>Featured Products</span>
              </motion.div>
              
              {Object.keys(subcategories).map((categoryName, index) => (
                <motion.div 
                  key={categoryName} 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (index * 0.1) }}
                >
                  <motion.div 
                    className="mobile-category"
                    onClick={() => handleMobileCategoryClick(categoryName)}
                    whileHover={{ x: 10, backgroundColor: 'rgba(0,0,0,0.1)' }}
                  >
                    {categoryIcons[categoryName]}
                    <span>{categoryName}</span>
                    <ChevronRight size={16} className={expandedCategory === categoryName ? 'rotated' : ''} />
                  </motion.div>
                  
                  {expandedCategory === categoryName && (
                    <motion.div 
                      className="mobile-subcategories active"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {subcategories[categoryName].map((subcat, subIndex) => (
                        <motion.div 
                          key={subcat}
                          className="mobile-subcategory"
                          onClick={() => handleMobileSubcategoryClick(subcat)}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: subIndex * 0.1 }}
                          whileHover={{ x: 15, backgroundColor: 'rgba(0,0,0,0.05)' }}
                        >
                          {subcat}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Bottom Section */}
      <div className='homeBottom'>
        {/* Left Sidebar - Categories */}
        <motion.div 
          className='homeLeft'
          initial={{ opacity: 0, x: -80, rotate: -5 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 1, delay: 2.0, ease: "easeOut" }}
          whileHover={{ x: 10 }}
        >
          <motion.h4
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.3 }}
          >
            Browse Categories
          </motion.h4>
          <div className='homeCategories'>
            <motion.div 
              className={`homeCategory featured-category ${displayMode === 'featured' ? 'active' : ''}`}
              onClick={handleShowFeatured}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4 }}
              whileHover={{ scale: 1.05, y: -5, backgroundColor: 'rgba(255, 107, 53, 0.15)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Flame size={20} color="#ff6b35" />
              <h3>Featured Products</h3>
            </motion.div>
            
            {Object.keys(subcategories).map((categoryName, index) => (
              <motion.div 
                key={categoryName} 
                className={`category-item ${selectedCategory === categoryName ? 'active' : ''}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 + (index * 0.1) }}
                whileHover={{ scale: 1.03, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className='homeCategory' onClick={() => handleCategoryClick(categoryName)}>
                  {categoryIcons[categoryName]}
                  <h3>{categoryName}</h3>
                  <ChevronRight size={16} className={selectedCategory === categoryName ? 'rotated' : ''} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Middle Section - Products Display */}
        <motion.div 
          className='homeMiddle'
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 2.2, ease: "easeOut" }}
          ref={featuredRef}
        >
          {/* REMOVED SORT OPTIONS COMPLETELY */}

          {/* Content based on display mode */}
          {displayMode === 'featured' && (
            <motion.div 
              className="section-header"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6 }}
            >
              {/* <div className="header-content"> */}
                {/* <motion.div animate={{ scale: [1, 1.2, 1], transition: { duration: 2, repeat: Infinity, repeatDelay: 3 } }}>
                  <Flame size={24} color="#ff6b35" />
                </motion.div> */}
                <div className='fixFeaturedColumn'>
                  <h5>Featured Listings 🔥</h5>
                  <p>Promoted items with maximum visibility</p>
                </div>
              {/* </div> */}
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <motion.div 
              className="loading-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Settings size={40} color="#ccc" />
              </motion.div>
              <p>Loading products...</p>
            </motion.div>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div 
              className="error-state"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <p>Error loading products: {error}</p>
              <button onClick={refetch}>Try Again</button>
            </motion.div>
          )}

          {/* Products Grid - ORIGINAL CARD STRUCTURE */}
          {!loading && !error && displayProducts.length > 0 && (
            <motion.div 
              className="homeCards"
              variants={containerVariants}
              initial="hidden"
              animate={isFeaturedInView ? "visible" : "hidden"}
            >
              {displayProducts.map((product, index) => {
                const verificationBadge = getVerificationBadge(product.sellerVerificationStatus);
                
                return (
                  <motion.div
                    key={product.id}
                    className={`homeCard ${product.featured ? 'featured' : ''} ${product.premium ? 'premium' : ''}`}
                    variants={itemVariants}
                    whileHover={{ 
                      y: -5,
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleProductClick(product.id)}
                  >
                    {/* Product Badges */}
                    <div className="product-badges">
                      {product.premium && (
                        <motion.span 
                          className="badge premium-badge"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200, delay: index * 0.1 }}
                        >
                          <Crown size={12} />
                          Premium
                        </motion.span>
                      )}
                      {product.featured && !product.premium && (
                        <motion.span 
                          className="badge featured-badge"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, delay: index * 0.1 }}
                        >
                          <Star size={12} />
                          Featured
                        </motion.span>
                      )}
                    </div>

                    {/* Product Image */}
                    <div className="card-image-container">
                      {product.images && product.images.length > 0 ? (
                        <motion.img 
                          src={product.images[0]} 
                          alt={product.title}
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        />
                      ) : (
                        <div className="no-image">
                          <div className="no-image-icon">📷</div>
                          <span>No Image</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Card Content - ORIGINAL STRUCTURE */}
                    <div className="card-content">
                      <div className="card-header">
                        <h3 className="product-title">{product.title}</h3>
                        <div className="price-section">
                          <span className="current-price">₦{product.price?.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <p className="product-description">
                        {product.description && product.description.length > 120 
                          ? `${product.description.substring(0, 120)}...` 
                          : product.description || 'No description available'
                        }
                      </p>
                      
                      {/* Product Meta Information */}
                      <div className="product-meta">
                        <div className="meta-item">
                          <span className="meta-label">Category:</span>
                          <span className="meta-value">{product.category}</span>
                        </div>
                        
                        {product.subcategory && (
                          <div className="meta-item">
                            <span className="meta-label">Type:</span>
                            <span className="meta-value">{product.subcategory}</span>
                          </div>
                        )}
                        
                        <div className="meta-item">
                          <span className="meta-label">Seller:</span>
                          <span 
                            className="verification-badge"
                            style={{ 
                              color: verificationBadge.color,
                              backgroundColor: verificationBadge.bgColor
                            }}
                          >
                            {verificationBadge.icon}
                            {verificationBadge.text}
                          </span>
                        </div>
                      </div>

                      {/* Product Stats */}
                      <div className="product-stats">
                        <div className="stat">
                          <Eye size={12} />
                          <span>{product.views || 0} views</span>
                        </div>
                        <div className="stat">
                          <Heart size={12} />
                          <span>{product.savedCount || 0} saves</span>
                        </div>
                        <div className="stat">
                          <Calendar size={12} />
                          <span>{formatDate(product.createdAt)}</span>
                        </div>
                      </div>
                      
                      {/* See More Indicator */}
                      <div className="card-actions">
                        <div className="see-more-indicator">
                          <MessageCircle size={16} />
                          Click to view details
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && displayProducts.length === 0 && (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 10, delay: 2.8 }}
            >
              <motion.div
                animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Search size={80} color="#ccc" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.2 }}
              >
                {displayMode === 'featured' ? 'No Featured Products Yet' : 'No Products Found'}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.4 }}
              >
                {displayMode === 'featured' 
                  ? 'Be the first to feature an item!' 
                  : 'No products match your selection.'}
              </motion.p>
              <motion.button 
                className="safety-btn"
                onClick={handleStartSelling}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 3.6 }}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.9 }}
              >
                List Your First Item
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Right Sidebar - Safety Tips */}
        <motion.div 
          className='homeRight'
          initial={{ opacity: 0, x: 80, y: 50, rotate: 5 }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          transition={{ duration: 1.2, delay: 2.4, ease: "easeOut" }}
          ref={safetyRef}
        >
          <motion.div 
            className="safety-section"
            variants={itemVariants}
            initial="hidden"
            animate={isSafetyInView ? "visible" : "hidden"}
            whileHover={{ scale: 1.05, y: -10, rotate: -1 }}
          >
            <div className="safety-header">
              <motion.div 
                className="safety-icon-container"
                animate={{ 
                  rotate: [0, -15, 15, -10, 10, 0],
                  scale: [1, 1.3, 1.2, 1.3, 1],
                  transition: { 
                    duration: 4, 
                    repeat: Infinity,
                    repeatDelay: 5
                  }
                }}
              >
                <Shield size={28} className="safety-icon" />
                <motion.div
                  className="sparkle"
                  initial={{ scale: 0, opacity: 0, rotate: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 1],
                    opacity: [0, 1, 1],
                    rotate: 360,
                    transition: { 
                      duration: 2,
                      delay: 3
                    }
                  }}
                >
                  <Sparkles size={16} color="gold" />
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.8 }}
              >
                <h5 className='changeColour'>Trade Safe with Confidence 🔒</h5>
                <p className='changeColour'>Your safety is our priority</p>
              </motion.div>
            </div>
            
            <motion.div 
              className="safety-highlight"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 150,
                delay: 3.0
              }}
            >
              <div className="verified-badge-large">
                <CheckCircle size={20} />
                <span>100% Verified UNILAG Students Only</span>
              </div>
              <p>Every seller is campus-verified for your safety</p>
            </motion.div>

            <div className="safety-tips">
              <motion.h6
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.2 }}
              >
                Safety Guidelines
              </motion.h6>
              {[
                { title: "Meet in Public Campus Spots", desc: "Library, Faculty buildings, faculty quadrangles" },
                { title: "Inspect Before Payment", desc: "Test electronics, check item condition" },
                { title: "Cash-on-Delivery Recommended", desc: "Avoid online payments for meet-up transactions" }
              ].map((tip, index) => (
                <motion.div 
                  key={index}
                  className="tip-item"
                  initial={{ 
                    opacity: 0, 
                    x: -60,
                    scale: 0.8
                  }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    scale: 1
                  }}
                  transition={{ 
                    delay: 3.4 + (index * 0.3),
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    x: 15,
                    scale: 1.05,
                    transition: { duration: 0.3 }
                  }}
                >
                  <motion.div 
                    className="tip-icon-container"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CheckCircle size={16} className="tip-icon" />
                  </motion.div>
                  <div className="tip-content">
                    <strong>{tip.title}</strong>
                    <p>{tip.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button 
              className="safety-btn" 
              onClick={handleSafetyGuide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 4.0,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ 
                scale: 1.15,
                y: -5,
                backgroundColor: "#2e7d32",
                transition: { 
                  type: "spring", 
                  stiffness: 400 
                }
              }}
              whileTap={{ scale: 0.9 }}
            >
              <Shield size={16} />
              Read Full Safety Guide
            </motion.button>
          </motion.div>
        </motion.div>
      </div>  
    </div>
  );
};

export default Home;