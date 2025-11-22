import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase'; 
import { saveProductForUser, unsaveProductForUser, isProductSaved, reportProduct, getVerificationStatus } from '../../firebase/firestore';
import { useToast } from '@chakra-ui/react';
import '../ProductDetail/ProductDetail.css';

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState(null);
    const [sellerVerification, setSellerVerification] = useState(null);
    
    // Report modal states
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportDescription, setReportDescription] = useState('');
    const [reporting, setReporting] = useState(false);

    // Get current user
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
        return unsubscribe;
    }, []);

    // Get actual product images from Firestore data
    const productImages = product?.images || 
                         (product?.imageUrl ? [product.imageUrl] : ['/default-image.jpg']);

    // Check if product is saved when user or product changes
    useEffect(() => {
        const checkIfSaved = async () => {
            if (user && productId) {
                try {
                    const result = await isProductSaved(user.uid, productId);
                    if (result.success) {
                        setIsSaved(result.saved);
                    }
                } catch (error) {
                    console.error('Error checking saved status:', error);
                }
            }
        };
        checkIfSaved();
    }, [user, productId]);

    // Fetch product and seller verification
    useEffect(() => {
        const fetchProductAndVerification = async () => {
            try {
                setLoading(true);
                const docRef = doc(db, "products", productId);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const productData = { 
                        id: docSnap.id, 
                        ...docSnap.data(),
                        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
                        updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
                    };
                    setProduct(productData);
                    console.log('✅ Product loaded:', productData);

                    // Fetch seller verification status
                    if (productData.sellerId) {
                        const verificationResult = await getVerificationStatus(productData.sellerId);
                        if (verificationResult.success) {
                            setSellerVerification(verificationResult.data);
                            console.log('✅ Seller verification:', verificationResult.data);
                        }
                    }
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
            fetchProductAndVerification();
        } else {
            setError('No product ID provided');
            setLoading(false);
        }
    }, [productId]);

    // Get verification badge info
    const getVerificationBadge = () => {
        if (!sellerVerification) {
            return { 
                text: 'Unverified Seller', 
                color: '#666666', 
                bgColor: '#f5f5f5', 
                icon: '❓',
                description: 'Seller verification status not available'
            };
        }

        switch (sellerVerification.status) {
            case 'verified':
                return { 
                    text: '✅ Verified UNILAG Student', 
                    color: '#2e7d32', 
                    bgColor: '#e8f5e9', 
                    icon: '✅',
                    description: 'This seller has been verified by our campus team'
                };
            case 'pending':
                return { 
                    text: '⏳ Verification Pending', 
                    color: '#f57c00', 
                    bgColor: '#fff3e0', 
                    icon: '⏳',
                    description: 'Seller verification is under review'
                };
            case 'rejected':
                return { 
                    text: '❌ Verification Failed', 
                    color: '#d32f2f', 
                    bgColor: '#ffebee', 
                    icon: '❌',
                    description: 'Seller verification was not approved'
                };
            default:
                return { 
                    text: '❓ Unverified Seller', 
                    color: '#666666', 
                    bgColor: '#f5f5f5', 
                    icon: '❓',
                    description: 'Seller has not completed verification'
                };
        }
    };

    // Navigation functions
    const nextImage = () => {
        setSelectedImage((prev) => 
            prev === productImages.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setSelectedImage((prev) => 
            prev === 0 ? productImages.length - 1 : prev - 1
        );
    };

    // Handle save/unsave product
    const handleSaveToggle = async () => {
        if (!user) {
            alert('Please sign in to save products');
            navigate('/login');
            return;
        }

        setSaving(true);
        try {
            if (isSaved) {
                const result = await unsaveProductForUser(user.uid, productId);
                if (result.success) {
                    setIsSaved(false);
                    toast({
                        title: "Removed from Saved",
                        status: "success",
                        duration: 2000,
                        isClosable: true,
                    });
                } else {
                    throw new Error(result.error);
                }
            } else {
                const result = await saveProductForUser(user.uid, productId);
                if (result.success) {
                    setIsSaved(true);
                    toast({
                        title: "Saved for Later",
                        status: "success",
                        duration: 2000,
                        isClosable: true,
                    });
                } else {
                    throw new Error(result.error);
                }
            }
        } catch (error) {
            console.error('Error toggling save:', error);
            
            toast({
                title: "Error",
                description: error.message || 'Failed to update saved products. Please try again.',
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setSaving(false);
        }
    };

    // Start conversation function - UPDATED with proper data validation
const startConversation = async (product, initialMessage) => {
    if (!user) {
        alert('Please sign in to message sellers');
        navigate('/login');
        return;
    }

    try {
        // Check if conversation already exists
        const existingConvQuery = query(
            collection(db, 'conversations'),
            where('participants', 'array-contains', user.uid),
            where('productId', '==', product.id)
        );

        const existingConvSnapshot = await getDocs(existingConvQuery);
        
        let conversationId;
        if (!existingConvSnapshot.empty) {
            // Conversation exists, navigate to messages
            conversationId = existingConvSnapshot.docs[0].id;
            navigate('/messages');
        } else {
            // Create new conversation with validated data
            const conversationData = {
                participants: [user.uid, product.sellerId],
                productId: product.id,
                productTitle: product.title || 'Unknown Product',
                productImage: (product.images && product.images[0]) || product.imageUrl || '/default-image.jpg',
                productPrice: product.price || 0,
                lastUpdated: serverTimestamp(),
                createdAt: serverTimestamp(),
                lastMessage: initialMessage || "Hi, I'm interested in this product",
                // Add seller info for better context
                sellerId: product.sellerId,
                sellerName: product.sellerName || 'Seller',
                buyerId: user.uid,
                buyerName: user.displayName || 'User',
            };

            console.log('Creating conversation with data:', conversationData);

            const conversationRef = await addDoc(collection(db, 'conversations'), conversationData);
            conversationId = conversationRef.id;
            
            // Send initial message
            const messageData = {
                text: initialMessage || "Hi, I'm interested in this product. Is it still available?",
                senderId: user.uid,
                senderName: user.displayName || 'User',
                timestamp: serverTimestamp(),
                read: false,
                type: 'text'
            };

            await addDoc(collection(db, 'conversations', conversationId, 'messages'), messageData);

            console.log('✅ Conversation created successfully:', conversationId);
            
            // Navigate to messages page
            navigate('/messages');
        }

    } catch (error) {
        console.error('❌ Error starting conversation:', error);
        
        // More specific error handling
        if (error.code === 'permission-denied') {
            toast({
                title: "Permission Denied",
                description: "You don't have permission to start a conversation.",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        } else {
            toast({
                title: "Failed to Start Conversation",
                description: "Please try again or contact support if the problem continues.",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        }
    }
};



    // Share product functionality
    const handleShareProduct = async () => {
        if (!product) return;
        
        const productUrl = `${window.location.origin}/product/${productId}`;
        const shareText = `Check out this product on UNILAG Yard: ${product.title} - ₦${product.price?.toLocaleString()}`;

        try {
            if (navigator.share) {
                // Use Web Share API if available (mobile devices)
                await navigator.share({
                    title: product.title,
                    text: shareText,
                    url: productUrl,
                });
            } else if (navigator.clipboard) {
                // Fallback: Copy to clipboard
                await navigator.clipboard.writeText(`${shareText}\n${productUrl}`);
                
                // Show success message
                toast({
                    title: "Link Copied!",
                    description: "Product link has been copied to clipboard",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = `${shareText}\n${productUrl}`;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                toast({
                    title: "Link Copied!",
                    description: "Product link has been copied to clipboard",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error sharing product:', error);
            
            // If sharing fails, still try to copy to clipboard
            try {
                await navigator.clipboard.writeText(`${shareText}\n${productUrl}`);
                toast({
                    title: "Link Copied!",
                    description: "Product link has been copied to clipboard",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } catch (clipboardError) {
                toast({
                    title: "Share Failed",
                    description: "Could not share product. Please try again.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    };

    // Report product functionality
    const openReportModal = (product) => {
        if (!user) {
            alert('Please sign in to report products');
            navigate('/login');
            return;
        }
        setReportReason('');
        setReportDescription('');
        setIsReportModalOpen(true);
    };

    const closeReportModal = () => {
        setIsReportModalOpen(false);
        setReportReason('');
        setReportDescription('');
    };

    const handleReportProduct = async () => {
        if (!reportReason.trim()) {
            alert('Please select a reason for reporting');
            return;
        }

        setReporting(true);
        try {
            const reportData = {
                reporterId: user.uid,
                reporterEmail: user.email,
                reporterName: user.displayName || 'Anonymous User',
                reportedProductId: product.id,
                reportedProductTitle: product.title,
                reportedSellerId: product.sellerId,
                reportedSellerName: product.sellerName || 'Unknown Seller',
                productCategory: product.category,
                productPrice: product.price,
                productCondition: product.condition,
                productLocation: product.location,
                reason: reportReason,
                description: reportDescription,
                status: 'pending',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            // Save report to Firebase
            const reportRef = await addDoc(collection(db, 'reports'), reportData);
            
            console.log('✅ Report saved to database with ID:', reportRef.id);

            toast({
                title: "Report Submitted Successfully",
                description: "Thank you for your report. It has been saved and will be reviewed by our admin team within 24 hours.",
                status: "success",
                duration: 6000,
                isClosable: true,
            });

            closeReportModal();
        } catch (error) {
            console.error('Error saving report to database:', error);
            toast({
                title: "Report Failed",
                description: "Failed to submit report. Please try again.",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        } finally {
            setReporting(false);
        }
    };

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

    const verificationBadge = getVerificationBadge();

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
                            src={productImages[selectedImage] || '/default-image.jpg'} 
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
                                    <span 
                                        className="verification-badge"
                                        style={{ 
                                            color: verificationBadge.color,
                                            backgroundColor: verificationBadge.bgColor
                                        }}
                                    >
                                        {verificationBadge.icon} {verificationBadge.text}
                                    </span>
                                </div>
                                {product.createdAt && (
                                    <div className="detail-item">
                                        <strong className="label">Listed:</strong> 
                                        <span>{product.createdAt.toLocaleDateString()}</span>
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
                        {(product.views || product.savedCount) && (
                            <div className="product-stats">
                                <div className="stat-item">
                                    <span className="stat-number">{product.views || 0}</span>
                                    <span className="stat-label">Views</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{product.savedCount || 0}</span>
                                    <span className="stat-label">Saves</span>
                                </div>
                            </div>
                        )}

                        {/* Verification Dialogue - Only show for verified sellers */}
                        {sellerVerification?.status === 'verified' && (
                            <div className="verification-dialogue">
                                <div className="dialogue-header">
                                    <span className="dialogue-icon">✅</span>
                                    <h4>Verified UNILAG Student</h4>
                                </div>
                                <div className="dialogue-content">
                                    <p>This seller has been verified by our campus team and is a current UNILAG student.</p>
                                    <div className="verification-details">
                                        <div className="detail-row">
                                            <span className="detail-label">Status:</span>
                                            <span className="detail-value verified">Verified</span>
                                        </div>
                                        {sellerVerification.submittedAt && (
                                            <div className="detail-row">
                                                <span className="detail-label">Verified Since:</span>
                                                <span className="detail-value">
                                                    {sellerVerification.submittedAt.toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pending Verification Dialogue */}
                        {sellerVerification?.status === 'pending' && (
                            <div className="pending-verification-dialogue">
                                <div className="dialogue-header">
                                    <span className="dialogue-icon">⏳</span>
                                    <h4>Verification Under Review</h4>
                                </div>
                                <div className="dialogue-content">
                                    <p>This seller's verification is currently being reviewed by our team.</p>
                                    <div className="verification-note">
                                        <strong>Note:</strong> You can still proceed with the transaction, but exercise caution.
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Trust & Safety */}
                        <div className="trust-safety-section">
                            <div className="trust-hint">
                                <span className="trust-icon">{verificationBadge.icon}</span>
                                <div className="trust-content">
                                    <strong>{verificationBadge.text}</strong>
                                    <p>{verificationBadge.description}</p>
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
                            <button 
    className="primary-cta"
    onClick={() => {
        if (!user) {
            alert('Please sign in to message sellers');
            navigate('/login');
            return;
        }
        
        // Start conversation with validated default message
        const defaultMessage = "Hi, I'm interested in this product. Is it still available?";
        startConversation(product, defaultMessage);
    }}
>
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
                                <button 
                                    className="share-btn"
                                    onClick={handleShareProduct}
                                >
                                    <span className="button-icon">📤</span>
                                    Share
                                </button>
                                <button 
                                    className='report-btn'
                                    onClick={() => openReportModal(product)}
                                >
                                    <span className="button-icon">🚩</span>
                                    Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Report Product Modal */}
            {isReportModalOpen && (
                <div className="modal-overlay report-modal-overlay">
                    <div className="modal-content report-modal">
                        <div className="modal-header">
                            <div className="modal-title-section">
                                <div className="modal-icon">🚩</div>
                                <div>
                                    <h3>Report This Product</h3>
                                    <p>Help us keep UNILAG Yard safe and trustworthy</p>
                                </div>
                            </div>
                            <button className="close-button" onClick={closeReportModal}>×</button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="report-product-info">
                                <img 
                                    src={productImages[0] || '/default-image.jpg'} 
                                    alt={product.title}
                                    className="report-product-image"
                                />
                                <div className="report-product-details">
                                    <h4>{product.title}</h4>
                                    <p className="report-product-price">₦{product.price?.toLocaleString()}</p>
                                    <p className="report-product-category">{product.category}</p>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="report-reason" className="form-label">
                                    Why are you reporting this product? *
                                </label>
                                <select 
                                    id="report-reason"
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="">Select a reason</option>
                                    <option value="fake_product">Fake or counterfeit product</option>
                                    <option value="wrong_category">Wrong category</option>
                                    <option value="prohibited_item">Prohibited or illegal item</option>
                                    <option value="suspicious_activity">Suspicious activity</option>
                                    <option value="inappropriate_content">Inappropriate content</option>
                                    <option value="wrong_price">Wrong price information</option>
                                    <option value="already_sold">Product already sold</option>
                                    <option value="spam">Spam or misleading information</option>
                                    <option value="other">Other reason</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="report-description" className="form-label">
                                    Additional details (optional)
                                </label>
                                <textarea 
                                    id="report-description"
                                    value={reportDescription}
                                    onChange={(e) => setReportDescription(e.target.value)}
                                    placeholder="Please provide more information about why you're reporting this product. This helps our team investigate properly."
                                    className="form-textarea"
                                    rows="4"
                                />
                                <div className="character-count">
                                    {reportDescription.length}/500 characters
                                </div>
                            </div>
                            
                            <div className="report-notice">
                                <div className="notice-icon">🔒</div>
                                <div className="notice-content">
                                    <strong>Your report is confidential</strong>
                                    <p>The seller will not be notified about your report. Our admin team will review it within 24 hours.</p>
                                </div>
                            </div>

                            <div className="safety-note">
                                <div className="safety-icon">🛡️</div>
                                <div className="safety-content">
                                    <strong>Safety Reminder:</strong> Never share personal information and always meet in public campus locations for transactions.
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            <button 
                                className="btn-secondary"
                                onClick={closeReportModal}
                                disabled={reporting}
                            >
                                Cancel
                            </button>
                            <button 
                                className={`btn-primary ${!reportReason ? 'btn-disabled' : ''}`}
                                onClick={handleReportProduct}
                                disabled={reporting || !reportReason}
                            >
                                {reporting ? (
                                    <>
                                        <div className="loading-spinner-small"></div>
                                        Submitting Report...
                                    </>
                                ) : (
                                    'Submit Report'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductDetail;