import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; 
import '../ProductDetail/ProductDetail.css';

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);

    // Sample images array - replace with your actual image data from Firestore
    const productImages = [
        product?.imageUrl || '/default-image.jpg',
        '/image2.jpg', // You'll replace these with actual image URLs from your product data
        '/image3.jpg',
        '/image4.jpg'
    ];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const docRef = doc(db, "products", productId);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const productData = { id: docSnap.id, ...docSnap.data() };
                    setProduct(productData);
                    // If you have multiple images in your product data, set them here
                    // setProductImages(productData.images || [productData.imageUrl]);
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                setError('Failed to load product');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    if (loading) return <div className="loading">Loading product details...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!product) return <div className="error">Product not found</div>;

    return (
        <div className="product-detail-page">
            {/* Safety Banner */}
            <div className='safety-info'>
                <strong>🛡️ Unilag Yard Rule: Transactions must be completed on campus for your safety</strong>
            </div>
            
            {/* Three Column Layout */}
            <div className='product-detail-layout'>
                {/* LEFT COLUMN - Thumbnail Gallery (Fixed) */}
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

                {/* MIDDLE COLUMN - Main Image (Fixed) */}
                <div className='main-image-column'>
                    <div className="main-image-container">
                        <img 
                            src={productImages[selectedImage]} 
                            alt={product.title}
                            className="main-product-image"
                            onError={(e) => {
                                e.target.src = '/default-image.jpg';
                            }}
                        />
                    </div>
                </div>

                {/* RIGHT COLUMN - Product Details (Scrollable) */}
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
                                    <strong className="label">Meet-up:</strong> 
                                    <span>{product.location}</span>
                                </div>
                                <div className="detail-item">
                                    <strong className="label">Seller:</strong> 
                                    <span>Verified UNILAG Student</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="description-section">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>

                        {/* Trust & Safety */}
                        <div className="trust-safety-section">
                            <div className="trust-hint">
                                ✅ Verified UNILAG Student Seller
                            </div>
                            <div className="safety-tip">
                                🛡️ Meet on campus. Stay safe.
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <button className="primary-cta">💬 Message Seller</button>
                            <button className="secondary-cta">❤️ Save for Later</button>
                            <button className='report-btn'>Report this listing</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;