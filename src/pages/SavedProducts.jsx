import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../pages/firebase';
import { getSavedProducts, unsaveProduct } from '../utils/firebaseSavedProducts';
import { 
  BookOpen, Smartphone, BedDouble, Shirt, Ticket, Gift, 
  MapPin, Heart, Trash2, ArrowLeft
} from "lucide-react";
import '../component/CSS/SavedProducts.css';

const SavedProducts = () => {
  const [savedProducts, setSavedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  // Category icons (same as home page)
  const categoryIcons = {
    "Textbooks & Academic": <BookOpen size={16} color="#2e7d32" />,
    "Electronics & Gadgets": <Smartphone size={16} color="#1565c0" />,
    "Hostel & Room Essentials": <BedDouble size={16} color="#7b1fa2" />,
    "Fashion & Clothing": <Shirt size={16} color="#d32f2f" />,
    "Services": <Ticket size={16} color="#f57c00" />,
    "Tickets & Events": <Ticket size={16} color="#00838f" />,
    "Free Stuff": <Gift size={16} color="#388e3c" />
  };

  // Get current user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadSavedProducts(currentUser.uid);
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const loadSavedProducts = async (userId) => {
    try {
      setLoading(true);
      const products = await getSavedProducts(userId);
      setSavedProducts(products);
    } catch (error) {
      console.error('Error loading saved products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveProduct = async (savedId, productId) => {
    if (!user) return;
    
    setRemovingId(savedId);
    try {
      await unsaveProduct(user.uid, productId);
      // Remove from local state
      setSavedProducts(prev => prev.filter(product => product.savedId !== savedId));
    } catch (error) {
      console.error('Error removing saved product:', error);
      alert('Failed to remove product from saved items');
    } finally {
      setRemovingId(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
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

        {/* Content */}
        {loading ? (
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <p>Loading your saved products...</p>
          </div>
        ) : savedProducts.length > 0 ? (
          <div className="saved-products-grid">
            {savedProducts.map((product) => (
              <div key={product.savedId} className="saved-product-card">
                <Link 
                  to={`/product/${product.id}`} 
                  className="product-link"
                >
                  <div className="card-image-container">
                    <img 
                      src={product.imageUrl || '/default-image.jpg'} 
                      alt={product.title}
                      onError={(e) => {
                        e.target.src = '/default-image.jpg';
                      }}
                    />
                    {product.featured && (
                      <div className="featured-badge">
                        Featured
                      </div>
                    )}
                    <div className="condition-badge">{product.condition}</div>
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
                      {product.description?.length > 100 
                        ? `${product.description.substring(0, 100)}...` 
                        : product.description
                      }
                    </p>
                    
                    <div className="product-meta">
                      <div className="meta-item">
                        {categoryIcons[product.category]}
                        <span>{product.category}</span>
                      </div>
                      <div className="meta-item">
                        <MapPin size={14} />
                        <span>{product.location}</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Unsave Button */}
                <button
                  className={`unsave-button ${removingId === product.savedId ? 'removing' : ''}`}
                  onClick={() => handleUnsaveProduct(product.savedId, product.id)}
                  disabled={removingId === product.savedId}
                >
                  <Trash2 size={16} />
                  {removingId === product.savedId ? 'Removing...' : 'Remove'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-saved">
            <div className="empty-icon">
              <Heart size={48} color="#ccc" />
            </div>
            <h3>No Saved Products Yet</h3>
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