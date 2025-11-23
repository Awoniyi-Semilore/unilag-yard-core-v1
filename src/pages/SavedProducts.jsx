import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { 
  getSavedProductsWithDetails, 
  unsaveProductForUser,
  checkUserHasSavedProducts 
} from '../firebase/firestore';
import { 
  BookOpen, Smartphone, BedDouble, Shirt, Ticket, Gift, 
  MapPin, Heart, Trash2, ArrowLeft, Eye, Calendar, CheckCircle2, Clock, Shield,
  MoreVertical, X
} from "lucide-react";
import '../component/CSS/SavedProducts.css';

const SavedProducts = () => {
  const [savedProducts, setSavedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');
  const [activeMenu, setActiveMenu] = useState(null); // Track which product's menu is open

  // Category icons
  const categoryIcons = {
    "Textbooks & Academic": <BookOpen size={16} color="#2e7d32" />,
    "Electronics & Gadgets": <Smartphone size={16} color="#1565c0" />,
    "Hostel & Room Essentials": <BedDouble size={16} color="#7b1fa2" />,
    "Fashion & Clothing": <Shirt size={16} color="#d32f2f" />,
    "Services": <Ticket size={16} color="#f57c00" />,
    "Tickets & Events": <Ticket size={16} color="#00838f" />,
    "Free Stuff": <Gift size={16} color="#388e3c" />
  };

  // Get seller verification status badge
  // In your SavedProducts.jsx, update the getVerificationBadge function:
const getVerificationBadge = (sellerVerificationStatus) => {
  // Handle undefined or null status
  if (!sellerVerificationStatus) {
    return { text: 'Unverified Seller', color: '#666666', bgColor: '#f5f5f5', icon: <Shield size={12} /> };
  }
  
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
    if (!date) return 'Recently';
    
    try {
      const now = new Date();
      const productDate = date instanceof Date ? date : new Date(date);
      
      if (isNaN(productDate.getTime())) return 'Recently';
      
      const diffTime = Math.abs(now - productDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'Today';
      if (diffDays === 2) return 'Yesterday';
      if (diffDays <= 7) return `${diffDays - 1} days ago`;
      
      return productDate.toLocaleDateString();
    } catch (error) {
      return 'Recently';
    }
  };

  // Get current user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        console.log('👤 User authenticated:', currentUser.uid);
        
        // First check if user has any saved products
        const checkResult = await checkUserHasSavedProducts(currentUser.uid);
        console.log('🔍 Check saved products result:', checkResult);
        setDebugInfo(`Has saved products: ${checkResult.hasSavedProducts}, Count: ${checkResult.count}`);
        
        // Then load the actual products
        await loadSavedProducts(currentUser.uid);
      } else {
        setLoading(false);
        setSavedProducts([]);
        setError(null);
      }
    });
    return unsubscribe;
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenu(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const loadSavedProducts = async (userId) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading saved products for user:', userId);
      
      const result = await getSavedProductsWithDetails(userId);
      console.log('📊 Saved products result:', result);
      
      if (result.success) {
        setSavedProducts(result.products);
        setDebugInfo(prev => prev + ` | Loaded: ${result.products.length} products`);
      } else {
        console.error('❌ Error loading saved products:', result.error);
        setError(result.error);
      }
    } catch (error) {
      console.error('💥 Error loading saved products:', error);
      setError('Failed to load saved products');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveProduct = async (savedId, productId, productTitle) => {
    if (!user) return;
    
    // Show confirmation dialog
    const isConfirmed = window.confirm(
      `Are you sure you want to remove "${productTitle}" from your saved products?`
    );
    
    if (!isConfirmed) {
      setActiveMenu(null); // Close the menu
      return;
    }
    
    setRemovingId(savedId);
    setActiveMenu(null); // Close the menu
    try {
      const result = await unsaveProductForUser(user.uid, productId);
      
      if (result.success) {
        // Remove from local state
        setSavedProducts(prev => prev.filter(product => product.savedId !== savedId));
        setDebugInfo(prev => prev + ` | Removed: ${productId}`);
      } else {
        console.error('Error removing saved product:', result.error);
        alert(result.error || 'Failed to remove product from saved items');
      }
    } catch (error) {
      console.error('Error removing saved product:', error);
      alert('Failed to remove product from saved items');
    } finally {
      setRemovingId(null);
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Price not set';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Handle saved date display
  const formatSavedDate = (savedAt) => {
    if (!savedAt) return '';
    
    try {
      const date = savedAt instanceof Date ? savedAt : new Date(savedAt);
      if (isNaN(date.getTime())) return '';
      return `Saved on ${date.toLocaleDateString()}`;
    } catch (error) {
      return '';
    }
  };

  // Toggle menu for a specific product
  const toggleMenu = (savedId, e) => {
    e.stopPropagation(); // Prevent closing immediately
    setActiveMenu(activeMenu === savedId ? null : savedId);
  };

  if (!user) {
    return (
      <div className="saved-products-page">
        <div className="saved-products-container">
          <div className="auth-required">
            <div className="auth-icon">🔒</div>
            <h2>Sign In Required</h2>
            <p>Please sign in to view your saved products</p>
            <Link to="/login" className="auth-button">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-products-page">
      <div className="saved-products-container">
        {/* Debug info - remove in production */}
        {/* {process.env.NODE_ENV === 'development' && debugInfo && (
          <div style={{ 
            background: '#f0f0f0', 
            padding: '10px', 
            margin: '10px 0', 
            borderRadius: '5px',
            fontSize: '12px',
            color: '#666',
            fontFamily: 'monospace'
          }}>
            🐛 Debug: {debugInfo}
          </div>
        )} */}

        {/* Header */}
        <div className="saved-header">
          <Link to="/" className="back-button">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <div className="header-content">
            <div className="header-icon">
              <Heart size={32} color="#e91e63" fill="#e91e63" />
            </div>
            <div className="header-text">
              <h1>Saved Products</h1>
              <p>Your favorite items for later</p>
            </div>
            <div className="saved-count">
              {savedProducts.length} {savedProducts.length === 1 ? 'item' : 'items'}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => user && loadSavedProducts(user.uid)} className="retry-button">
              Try Again
            </button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <p>Loading your saved products...</p>
          </div>
        ) : savedProducts.length > 0 ? (
          <div className="saved-products-grid three-column">
            {savedProducts.map((product) => {
              const verificationBadge = getVerificationBadge(product.sellerVerificationStatus);
              
              return (
                <div key={product.savedId} className="saved-product-card">
                  {/* Three-dot menu button */}
                  <div className="card-menu-container">
                    <button 
                      className="menu-button"
                      onClick={(e) => toggleMenu(product.savedId, e)}
                    >
                      <MoreVertical size={16} />
                    </button>
                    
                    {/* Dropdown menu */}
                    {activeMenu === product.savedId && (
                      <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="menu-item remove-item"
                          onClick={() => handleUnsaveProduct(
                            product.savedId, 
                            product.id, 
                            product.title
                          )}
                          disabled={removingId === product.savedId}
                        >
                          <Trash2 size={16} />
                          {removingId === product.savedId ? 'Removing...' : 'Remove from Saved'}
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <Link 
                    to={`/product/${product.id}`} 
                    className="product-link"
                  >
                    <div className="card-image-container">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.title}
                          onError={(e) => {
                            e.target.src = '/default-image.jpg';
                          }}
                        />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                      {product.featured && (
                        <div className="featured-badge">
                          Featured
                        </div>
                      )}
                      {product.premium && (
                        <div className="premium-badge">
                          Premium
                        </div>
                      )}
                    </div>
                    
                    <div className="card-content">
                      <div className="card-header">
                        <h3 className="product-title">{product.title}</h3>
                        <div className="price-section">
                          <span className="current-price">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="product-description">
                        {product.description && product.description.length > 100 
                          ? `${product.description.substring(0, 100)}...` 
                          : product.description || 'No description available'
                        }
                      </p>
                      
                      <div className="product-meta">
                        <div className="meta-item">
                          {categoryIcons[product.category] || <BookOpen size={16} color="#666" />}
                          <span>{product.category || 'Uncategorized'}</span>
                        </div>
                        
                        {product.subcategory && (
                          <div className="meta-item">
                            <span>Type: {product.subcategory}</span>
                          </div>
                        )}
                        
                        <div className="meta-item">
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

                      {/* Saved Date */}
                      {product.savedAt && (
                        <div className="saved-date">
                          <small>{formatSavedDate(product.savedAt)}</small>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-saved">
            <div className="empty-icon">
              <Heart size={48} color="#ccc" />
            </div>
            <h3>No Saved Products Yet.</h3>
            <p>Start saving products you're interested in by clicking the heart icon on product pages</p>
            <Link to="/" className="browse-button">
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedProducts;