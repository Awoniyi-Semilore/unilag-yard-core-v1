import React, { useState, useEffect, useRef } from 'react';
import { getProducts, addSampleProducts } from '../utils/firebaseProducts'; // ✅ FIREBASE
import '../component/CSS/Home.css';
import homePageImage from "../media/homePageImage.jpg";
import { Link } from 'react-router-dom';
import homeImg from '../media/Selection.jpg';
import { 
  BookOpen, Smartphone, BedDouble, Shirt, Ticket, Gift, 
  ChevronRight, Shield, CheckCircle, Settings, Flame, X,
  MapPin, Clock, MessageCircle
} from "lucide-react";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [displayMode, setDisplayMode] = useState('featured');
  const [loading, setLoading] = useState(true);
  const categoriesRef = useRef(null);

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

  // Load products from Firebase
  useEffect(() => {
    loadInitialProducts();
  }, []);

  const loadInitialProducts = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading products from Firebase...');
      const products = await getProducts({ featured: true });
      
      if (products.length === 0) {
        console.log('📝 No products found. Adding sample data...');
        const success = await addSampleProducts();
        if (success) {
          const newProducts = await getProducts({ featured: true });
          setAllProducts(newProducts);
          setFilteredProducts(newProducts);
        }
      } else {
        setAllProducts(products);
        setFilteredProducts(products);
      }
    } catch (error) {
      console.error('❌ Error loading products:', error);
    }
    setLoading(false);
  };

  const handleCategoryClick = (categoryName) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
      setDisplayMode('featured');
      handleShowFeatured();
    } else {
      setSelectedCategory(categoryName);
      setDisplayMode('subcategories');
    }
  };

  const handleSubcategoryClick = async (subcategory) => {
  console.log('🔍 [DEBUG] Filtering:', selectedCategory, '->', subcategory);
  
  setSelectedSubcategory(subcategory);
  setDisplayMode('products');
  
  try {
    let products;
    if (subcategory === "Featured") {
      products = await getProducts({ featured: true });
    } else {
      // Debug: Check what we're sending to Firebase
      console.log('🔍 [DEBUG] Firebase query:', {
        category: selectedCategory,
        subcategory: subcategory
      });
      
      products = await getProducts({ 
        category: selectedCategory, 
        subcategory: subcategory 
      });
      
      console.log('🔍 [DEBUG] Firebase returned:', products.length, 'products');
      console.log('🔍 [DEBUG] Product subcategories:', products.map(p => p.subcategory));
    }
    
    setFilteredProducts(products);
  } catch (error) {
    console.error('Error filtering products:', error);
  }
};

  const handleShowFeatured = async () => {
    setDisplayMode('featured');
    setSelectedSubcategory(null);
    setSelectedCategory(null);
    const products = await getProducts({ featured: true });
    setFilteredProducts(products);
  };

  const closeSubcategories = () => {
    setSelectedCategory(null);
    setDisplayMode('featured');
    handleShowFeatured();
  };

  // Close subcategories when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setSelectedCategory(null);
        if (displayMode === 'subcategories') {
          setDisplayMode('featured');
          handleShowFeatured();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [displayMode]);

  return (
    <div className='home'>
      {/* Top Section - Keep exactly as you had it */}
      <div className='homeTop'>
        <div className='homeTopLeft'>
          <h5>The Official Marketplace for UNILAG Students.</h5>
          <h3>Your trusted community to find deals, sell textbooks, and connect with campus mates. 100% verified students.</h3>
          
          <div className='homeTopBtns'>
            <div><Link to='' className='homeTopBtns1'>Find Deals</Link></div>
            <div><Link to='' className='homeTopBtns2'>Join Now</Link></div>
          </div>
        </div>

        <div className='homeTopRight'>
          <img src={homePageImage} alt="A Lady showing something on her phone to her friend" />
        </div>
      </div>

      {/* Bottom Section */}
      <div className='homeBottom'>
        {/* Left Sidebar - Categories */}
        <div className='homeLeft' ref={categoriesRef}>
          <h4>Browse Categories</h4>
          <div className='homeCategories'>
            <div 
              className={`homeCategory featured-category ${displayMode === 'featured' ? 'active' : ''}`}
              onClick={handleShowFeatured}
            >
              <Flame size={20} color="#ff6b35" />
              <h3>Featured Products</h3>
            </div>
            
            {Object.keys(subcategories).map((categoryName) => (
              <div 
                key={categoryName} 
                className={`category-item ${selectedCategory === categoryName ? 'active' : ''}`}
              >
                <div 
                  className='homeCategory'
                  onClick={() => handleCategoryClick(categoryName)}
                >
                  {categoryIcons[categoryName]}
                  <h3>{categoryName}</h3>
                  <ChevronRight 
                    size={16} 
                    color="#4e5d6c" 
                    className={selectedCategory === categoryName ? 'rotated' : ''}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Section - Dynamic Content */}
        <div className='homeMiddle'>
          {loading ? (
            <div className="loading">🔄 Loading products from database...</div>
          ) : (
            <>
              {displayMode === 'featured' && (
                <>
                  <div className="section-header">
                    <div className="header-content">
                      <Flame size={24} color="#ff6b35" />
                      <div>
                        <h5>Featured Listings 🔥</h5>
                        <p>Promoted items with maximum visibility</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {displayMode === 'subcategories' && selectedCategory && (
                <>
                  <div className="section-header">
                    <div className="subcategory-header">
                      <div className="header-content">
                        {categoryIcons[selectedCategory]}
                        <div>
                          <h5>Browse {selectedCategory}</h5>
                          <p>Choose a subcategory to explore products</p>
                        </div>
                      </div>
                      <button className="close-button" onClick={closeSubcategories}>
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="subcategories-grid">
                    {subcategories[selectedCategory].map((subcat) => (
                      <div 
                        key={subcat} 
                        className="subcategory-card"
                        onClick={() => handleSubcategoryClick(subcat)}
                      >
                        <span>{subcat}</span>
                        <ChevronRight size={16} color="#666" />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {displayMode === 'products' && (
                <>
                  <div className="section-header">
                    <div className="products-header">
                      <div className="header-content">
                        <h5>Showing: {selectedSubcategory}</h5>
                        <p>{filteredProducts.length} products found in {selectedCategory}</p>
                      </div>
                      <button className="back-button" onClick={handleShowFeatured}>
                        ← Back to Featured
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Products Grid */}
              {(displayMode === 'featured' || displayMode === 'products') && (
                <div className='homeCards'>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <div key={product.id} className='homeCard'>
                        <div className="card-image-container">
                          <img src={homeImg} alt={product.title} />
                          {product.featured && (
                            <div className="featured-badge">
                              <Flame size={12} />
                              Featured
                            </div>
                          )}
                          <div className="condition-badge">{product.condition}</div>
                        </div>
                        
                        <div className="card-content">
                          <div className="card-header">
                            <h3 className="product-title">{product.title}</h3>
                            <div className="price-section">
                              <span className="current-price">₦ {product.price?.toLocaleString()}</span>
                              {product.originalPrice && (
                                <span className="original-price">₦ {product.originalPrice.toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                          
                          <p className="product-description">{product.description}</p>
                          
                          <div className="product-meta">
                            <div className="meta-item">
                              <MapPin size={14} />
                              <span>{product.location}</span>
                            </div>
                            <div className="meta-item">
                              <Clock size={14} />
                              <span>{product.views} views</span>
                            </div>
                          </div>
                          
                          <div className="card-actions">
                            <button className="message-btn">
                              <MessageCircle size={16} />
                              See More
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-products">
                      <div className="no-products-content">
                        <Flame size={48} color="#ccc" />
                        <h3>No products found</h3>
                        <p>Try browsing different categories or check back later</p>
                        <button className="safety-btn" onClick={handleShowFeatured} style={{marginTop: '16px'}}>
                          Show Featured Products
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Sidebar - Safety Tips */}
        <div className='homeRight'>
          <div className="safety-section">
            <div className="safety-header">
              <div className="safety-icon-container">
                <Shield size={24} className="safety-icon" />
              </div>
              <div>
                <h5>Trade Safe with Confidence 🔒</h5>
                <p>Your safety is our priority</p>
              </div>
            </div>
            
            <div className="safety-highlight">
              <div className="verified-badge-large">
                <CheckCircle size={20} />
                <span>100% Verified UNILAG Students Only</span>
              </div>
              <p>Every user is campus-verified for your safety</p>
            </div>

            <div className="safety-tips">
              <h6>Safety Guidelines</h6>
              <div className="tip-item">
                <div className="tip-icon-container">
                  <CheckCircle size={16} className="tip-icon" />
                </div>
                <div className="tip-content">
                  <strong>Meet in Public Campus Spots</strong>
                  <p>Library, Faculty buildings, Student Union</p>
                </div>
              </div>
              
              <div className="tip-item">
                <div className="tip-icon-container">
                  <CheckCircle size={16} className="tip-icon" />
                </div>
                <div className="tip-content">
                  <strong>Inspect Before Payment</strong>
                  <p>Test electronics, check item condition</p>
                </div>
              </div>
              
              <div className="tip-item">
                <div className="tip-icon-container">
                  <CheckCircle size={16} className="tip-icon" />
                </div>
                <div className="tip-content">
                  <strong>Cash-on-Delivery Recommended</strong>
                  <p>Avoid online payments for meet-up transactions</p>
                </div>
              </div>
            </div>

            <button className="safety-btn">
              <Shield size={16} />
              Read Full Safety Guide
            </button>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default Home;