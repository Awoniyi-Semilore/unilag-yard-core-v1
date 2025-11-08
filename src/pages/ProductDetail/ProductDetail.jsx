import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; 
import { saveProduct, unsaveProduct, isProductSaved } from '../../utils/firebaseSavedProducts';
import { auth } from '../firebase';
import '../ProductDetail/ProductDetail.css';
  {
    alert('Please sign in to save products');
    navigate('/login'); // Optional: redirect to login
    return;
  }

  setSaving(true);
  try {
    if (isSaved) {
      await unsaveProduct(user.uid, productId);
      setIsSaved(false);
    } else {
      await saveProduct(user.uid, productId);
      setIsSaved(true);
    }
  } catch (error) {
    console.error('Error toggling save:', error);
    
    // Show user-friendly error messages
    if (error.message.includes('permission') || error.message.includes('sign in')) {
      alert(error.message);
    } else {
      alert('Failed to update saved products. Please try again.');
    }
  } finally {
    setSaving(false);
  }


    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [productImages.length]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const docRef = doc(db, "products", productId);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const productData = { id: docSnap.id, ...docSnap.data() };
                    setProduct(productData);
                    console.log('✅ Product loaded:', productData);
                } else {
                    setError('Product not found');
                    console.log('❌ Product not found:', productId);
                }
            } catch (err) {
                console.error('❌ Error loading product:', err);
                setError('Failed to load product from database');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        } else {
            setError('No product ID provided');
            setLoading(false);
        }
    }, [productId]);

    if (loading) return (
        <div className="product-detail-page">
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading product details...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="product-detail-page">
            <div className="error-container">
                <div className="error-icon">⚠️</div>
                <h3>{error}</h3>
                <p>Please check the product URL or try again later.</p>
                <button 
                    className="primary-cta" 
                    onClick={() => window.history.back()}
                >
                    ← Go Back
                </button>
            </div>
        </div>
    );

    if (!product) return (
        <div className="product-detail-page">
            <div className="error-container">
                <div className="error-icon">❌</div>
                <h3>Product Not Found</h3>
                <p>The product you're looking for doesn't exist or has been removed.</p>
                <button 
                    className="primary-cta" 
                    onClick={() => window.history.back()}
                >
                    ← Go Back
                </button>
            </div>
        </div>
    );

    return (
        <div className="product-detail-page">
            {/* Safety Banner */}
            <div className='safety-info'>
                <strong>🛡️ Unilag Yard Rule: Transactions must be completed on campus for your safety</strong>
            </div>
            
            {/* Three Column Layout */}
            <div className='product-detail-layout'>
                {/* LEFT COLUMN - Thumbnail Gallery (Desktop only) */}
                <div className='thumbnail-sidebar'>
                    <div className="thumbnail-gallery">
                        {productImages.map((image, index) => (
                            <div 
                                key={index}
                                className={`thumbnail-item ${selectedImage === index ? 'active' : ''}`}
                                onClick={() => setSelectedImage(index)}
                            >
                                <img 
                                    src={image} 
                                    alt={`${product.title} view ${index + 1}`}
                                    onError={(e) => {
                                        e.target.src = '/default-image.jpg';
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* MIDDLE COLUMN - Main Image */}
                <div className='main-image-column'>
                    {/* Navigation Arrows (Visible on Tablet & Mobile) */}
                    {productImages.length > 1 && (
                        <>
                            <div className="image-navigation">
                                <button 
                                    className="nav-arrow prev-arrow" 
                                    onClick={prevImage} 
                                    aria-label="Previous image"
                                >
                                    ‹
                                </button>
                                <button 
                                    className="nav-arrow next-arrow" 
                                    onClick={nextImage} 
                                    aria-label="Next image"
                                >
                                    ›
                                </button>
                            </div>
                            
                            {/* Image Counter (Tablet & Mobile) */}
                            <div className="image-counter">
                                {selectedImage + 1} / {productImages.length}
                            </div>
                        </>
                    )}

                    <div className="main-image-container">
                        <img 
                            src={productImages[selectedImage]} 
                            alt={product.title}
                            className="main-product-image"
                            onError={(e) => {
                                e.target.src = '/default-image.jpg';
                                console.error('Failed to load product image');
                            }}
                        />
                        
                        {/* Image counter for desktop (overlay) */}
                        {productImages.length > 1 && (
                            <div className="desktop-image-counter">
                                Photo {selectedImage + 1} of {productImages.length}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN - Product Details */}
                <div className='details-sidebar'>
                    <div className="product-details-card">
                        <div className="product-info">
                            <h1 className="product-title">{product.title}</h1>
                            <div className="price">₦{product.price?.toLocaleString()}</div>
                            <div className="condition-pill">{product.condition}</div>
                            
                            {/* Key Details */}
                            <div className="key-details">
                                <div className="detail-item">
                                    <strong className="label">Category:</strong> 
                                    <span>{product.category}</span>
                                </div>
                                <div className="detail-item">
                                    <strong className="label">Meet-up Location:</strong> 
                                    <span>{product.location}</span>
                                </div>
                                <div className="detail-item">
                                    <strong className="label">Seller Status:</strong> 
                                    <span className="verified-badge">✅ Verified UNILAG Student</span>
                                </div>
                                {product.createdAt && (
                                    <div className="detail-item">
                                        <strong className="label">Listed:</strong> 
                                        <span>{new Date(product.createdAt?.toDate()).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="description-section">
                            <h3>Description</h3>
                            <p className="description-text">{product.description}</p>
                        </div>

                        {/* Stats (if available) */}
                        {(product.views || product.saves) && (
                            <div className="product-stats">
                                <div className="stat-item">
                                    <span className="stat-number">{product.views || 0}</span>
                                    <span className="stat-label">Views</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{product.saves || 0}</span>
                                    <span className="stat-label">Saves</span>
                                </div>
                            </div>
                        )}

                        {/* Trust & Safety */}
                        <div className="trust-safety-section">
                            <div className="trust-hint">
                                <span className="trust-icon">✅</span>
                                <div className="trust-content">
                                    <strong>Verified UNILAG Student Seller</strong>
                                    <p>This seller has been verified by our campus team</p>
                                </div>
                            </div>
                            <div className="safety-tip">
                                <span className="safety-icon">🛡️</span>
                                <div className="safety-content">
                                    <strong>Safety First</strong>
                                    <p>Always meet in public campus locations and inspect items before payment</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <button className="primary-cta">
                                <span className="button-icon">💬</span>
                                Message Seller
                            </button>
                            <button 
                                className={`secondary-cta ${isSaved ? 'saved' : ''}`}
                                onClick={handleSaveToggle}
                                disabled={saving}
                            >
                                <span className="button-icon">
                                    {isSaved ? '💖' : '🤍'}
                                </span>
                                {saving ? 'Saving...' : (isSaved ? 'Saved' : 'Save for Later')}
                            </button>
                            <div className="button-group">
                                <button className="share-btn">
                                    <span className="button-icon">📤</span>
                                    Share
                                </button>
                                <button className='report-btn'>
                                    <span className="button-icon">🚩</span>
                                    Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

export default ProductDetail;