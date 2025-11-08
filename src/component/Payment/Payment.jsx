import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useFlutterwave } from '../../Hooks/useFlutterwave';
import { generateTransactionRef, getFlutterwaveConfig } from '../../Services/flutterwaveService';
import './Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { launchFlutterwave, isLoading, error } = useFlutterwave();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userData, setUserData] = useState(null);
  const [config, setConfig] = useState(getFlutterwaveConfig());
  
  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [hasProcessedRedirect, setHasProcessedRedirect] = useState(false);

  // Production plan definitions
  const planDefinitions = {
    standard: { 
      name: 'Standard', 
      price: 500, 
      type: 'one-time',
      features: [
        'List 1 product for 30 days',
        'Basic marketplace visibility',
        'Secure campus transactions',
        'Buyer-seller messaging',
        'Campus meetup coordination'
      ]
    },
    featured: { 
      name: 'Featured', 
      price: 1000, 
      type: 'one-time',
      features: [
        'List 1 product for 30 days',
        'Featured on homepage carousel',
        'Priority search ranking',
        'Secure campus transactions',
        'Buyer-seller messaging',
        'Campus meetup coordination',
        'Premium product badge'
      ]
    },
    pro: { 
      name: 'Pro', 
      price: 1500, 
      type: 'monthly',
      features: [
        'Unlimited product listings',
        '30-day subscription access',
        'Basic marketplace visibility',
        'Secure campus transactions',
        'Buyer-seller messaging',
        'Campus meetup coordination',
        'Bulk listing management'
      ]
    },
    premium: { 
      name: 'Premium', 
      price: 2000, 
      type: 'monthly',
      features: [
        'Unlimited product listings',
        'All items featured on homepage',
        'Maximum search visibility',
        'Top priority in category listings',
        'Secure campus transactions',
        'Buyer-seller messaging',
        'Campus meetup coordination',
        'Bulk listing management',
        'Premium seller badge',
        'Advanced analytics dashboard'
      ]
    }
  };

  // Check for URL parameters after Flutterwave redirect
  useEffect(() => {
    const status = searchParams.get('status');
    const transactionId = searchParams.get('transaction_id');
    const txRef = searchParams.get('tx_ref');
    
    console.log('URL Parameters:', { status, transactionId, txRef });
    
    // Prevent processing the same redirect multiple times
    if (hasProcessedRedirect) return;
    
    if (status === 'successful') {
      const planKey = location.state?.plan;
      if (planKey && planDefinitions[planKey]) {
        const plan = planDefinitions[planKey];
        
        console.log('Payment successful via redirect, navigating to submit-product');
        setHasProcessedRedirect(true);
        
        // Navigate directly to submit product WITHOUT showing modal
        navigate('/submit-product', {
          state: {
            paymentSuccess: true,
            plan: plan,
            transactionId: transactionId,
            txRef: txRef
          },
          replace: true
        });
      }
    } else if (status === 'cancelled' || status === 'failed') {
      console.log('Payment failed via redirect:', status);
      setHasProcessedRedirect(true);
      setPaymentResult({
        success: false,
        error: status === 'cancelled' ? 'Payment was cancelled' : 'Payment failed'
      });
      setShowErrorModal(true);
      
      // Clear URL parameters but stay on payment page
      navigate('/payment', { state: location.state, replace: true });
    }
  }, [searchParams, location, navigate, hasProcessedRedirect]);

  // Initialize payment page
  useEffect(() => {
    const initializePaymentPage = () => {
      // Get selected plan from navigation
      const planKey = location.state?.plan;
      if (!planKey || !planDefinitions[planKey]) {
        navigate('/addProduct', { replace: true });
        return;
      }

      setSelectedPlan(planDefinitions[planKey]);

      // In production, get user data from auth context
      const mockUserData = {
        email: 'student@unilag.edu.ng',
        name: 'Unilag Student',
        phone: '+2348012345678',
        userId: 'user-123456'
      };
      setUserData(mockUserData);
    };

    initializePaymentPage();
  }, [location, navigate]);

  const processPayment = async () => {
    if (!selectedPlan || !userData || !config) return;

    try {
      const transactionRef = generateTransactionRef(selectedPlan.name);

      const paymentConfig = {
        public_key: config.publicKey,
        tx_ref: transactionRef,
        amount: selectedPlan.price,
        currency: 'NGN',
        payment_options: 'card, banktransfer, ussd, mobilemoney, account',
        redirect_url: `${window.location.origin}/payment?plan=${location.state?.plan}`, // Include plan in redirect URL
        customer: {
          email: userData.email,
          phone_number: userData.phone,
          name: userData.name,
        },
        customizations: {
          title: 'Unilag Yard',
          description: `${selectedPlan.name} Plan - Campus Marketplace Listing`,
          logo: `${window.location.origin}/logo.png`,
        },
        meta: {
          user_id: userData.userId,
          plan_name: selectedPlan.name,
          plan_type: selectedPlan.type,
          campus: 'UNILAG',
          environment: config.environment,
          plan_key: location.state?.plan // Store plan key for redirect
        }
      };

      console.log('Starting Flutterwave payment...', paymentConfig);

      const response = await launchFlutterwave(paymentConfig);
      
      console.log('Flutterwave Response:', response);
      
      // This will only execute for direct API responses (not redirects)
      if (response.success) {
        // Payment successful via direct API - show success modal
        setPaymentResult({
          success: true,
          transactionId: response.transactionId,
          plan: selectedPlan
        });
        setShowSuccessModal(true);
        
        // Save payment record (in production, call your API)
        const paymentRecord = {
          userId: userData.userId,
          plan: selectedPlan.name,
          amount: selectedPlan.price,
          transactionId: response.transactionId,
          flwRef: response.flwRef,
          txRef: response.txRef,
          status: 'completed',
          timestamp: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
        console.log('Payment record saved:', paymentRecord);
        
      } else {
        // Payment failed via direct API - show error modal
        setPaymentResult({
          success: false,
          error: response.error || 'Payment processing failed'
        });
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setPaymentResult({
        success: false,
        error: error.message || 'Payment processing failed'
      });
      setShowErrorModal(true);
    }
  };

  const handleSuccessContinue = () => {
    setShowSuccessModal(false);
    // Navigate to submit product page (for direct API payments)
    navigate('/submit-product', {
      state: {
        paymentSuccess: true,
        plan: selectedPlan,
        transactionId: paymentResult?.transactionId
      },
      replace: true
    });
  };

  const handleErrorRetry = () => {
    setShowErrorModal(false);
    // Stay on same page, user can retry
  };

  const handleErrorChooseDifferent = () => {
    setShowErrorModal(false);
    navigate('/addProduct');
  };

  const getEnvironmentBadge = () => {
    if (!config) return null;
    
    return config.isLive ? (
      <div className="environment-badge live">
        🚀 LIVE MODE - Real payments enabled
      </div>
    ) : (
      <div className="environment-badge test">
        🛠️ TEST MODE - No real money charged
      </div>
    );
  };

  // Debug state
  useEffect(() => {
    console.log('Payment Component State:', {
      selectedPlan: selectedPlan?.name,
      showSuccessModal,
      showErrorModal,
      paymentResult,
      isLoading,
      error,
      hasProcessedRedirect
    });
  }, [selectedPlan, showSuccessModal, showErrorModal, paymentResult, isLoading, error, hasProcessedRedirect]);

  if (!selectedPlan) {
    return (
      <div className="payment-loading">
        <div className="spinner"></div>
        <p>Loading payment details...</p>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>Complete Your Listing Purchase</h1>
          <p>You're about to activate the <strong>{selectedPlan.name} Plan</strong></p>
          {getEnvironmentBadge()}
        </div>

        {error && (
          <div className="payment-error-alert">
            <span>⚠️</span>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        <div className="payment-summary">
          <div className="plan-summary-card">
            <div className="plan-header">
              <h2>{selectedPlan.name} Plan</h2>
              <div className="price-section">
                <div className="price">₦{selectedPlan.price.toLocaleString()}</div>
                <div className="billing-info">
                  {selectedPlan.type === 'one-time' ? 'One-time payment' : 'Monthly subscription'}
                </div>
                <div className="duration">Active for 30 days</div>
              </div>
            </div>

            <div className="features-section">
              <h3>Plan Features:</h3>
              <ul className="features-list">
                {selectedPlan.features.map((feature, index) => (
                  <li key={index}>
                    <span className="feature-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="payment-security">
          <div className="security-assurance">
            <h4>🔒 Secure Payment</h4>
            <p>Your payment is processed securely by Flutterwave, trusted by millions of businesses worldwide.</p>
            <div className="security-badges">
              <span>PCI DSS Compliant</span>
              <span>Bank-Level Security</span>
              <span>SSL Encrypted</span>
            </div>
          </div>
        </div>

        <div className="payment-actions">
          <button 
            className={`pay-now-btn ${isLoading ? 'loading' : ''}`}
            onClick={processPayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Processing Secure Payment...
              </>
            ) : (
              `Pay ₦${selectedPlan.price.toLocaleString()} Now`
            )}
          </button>
          
          <div className="secondary-actions">
            <button 
              className="back-btn"
              onClick={() => navigate('/addProduct')}
              disabled={isLoading}
            >
              ← Choose Different Plan
            </button>
            <button 
              className="support-btn"
              onClick={() => window.open('mailto:support@unilagyard.com', '_blank')}
            >
              Need Help?
            </button>
          </div>
        </div>

        {/* Test Modal Button - Remove in production */}
        <div style={{ textAlign: 'center', marginTop: '2rem', padding: '1rem', border: '2px dashed #ccc', borderRadius: '8px' }}>
          <p style={{ marginBottom: '1rem', color: '#666' }}>Debug Tools:</p>
          <button 
            onClick={() => {
              // Test Success Modal (for direct API payments)
              setPaymentResult({ success: true, transactionId: 'TEST-12345' });
              setShowSuccessModal(true);
            }}
            style={{ 
              background: '#4caf50', 
              color: 'white', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              borderRadius: '6px',
              marginRight: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Test Success Modal
          </button>
          <button 
            onClick={() => {
              // Test direct navigation to submit-product (simulating redirect flow)
              navigate('/submit-product', {
                state: {
                  paymentSuccess: true,
                  plan: selectedPlan,
                  transactionId: 'TEST-REDIRECT-12345'
                },
                replace: true
              });
            }}
            style={{ 
              background: '#2196f3', 
              color: 'white', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              borderRadius: '6px',
              marginRight: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Test Redirect to Submit Product
          </button>
          <button 
            onClick={() => {
              setPaymentResult({ success: false, error: 'Test error message' });
              setShowErrorModal(true);
            }}
            style={{ 
              background: '#f44336', 
              color: 'white', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Test Error Modal
          </button>
        </div>

        {!config.isLive && (
          <div className="test-environment-notice">
            <h4>💳 Testing Instructions</h4>
            <div className="test-details">
              <p><strong>Test Card:</strong> 5531 8866 5214 2950</p>
              <p><strong>CVV:</strong> 564 | <strong>Expiry:</strong> 09/32 | <strong>PIN:</strong> 3310</p>
              <p><strong>OTP:</strong> 12345 (when prompted)</p>
            </div>
            <p className="test-disclaimer">
              This is a test environment. No real money will be charged. 
              Use the test card details above to simulate a payment.
            </p>
          </div>
        )}

        <div className="payment-footer">
          <p className="terms-notice">
            By completing this purchase, you agree to our{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* Success Modal - Only shown for direct API payments, not redirects */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content success-modal">
            <div className="modal-icon">🎉</div>
            <h2>Payment Successful!</h2>
            <p>Your <strong>{selectedPlan?.name} Plan</strong> has been activated successfully.</p>
            {paymentResult?.transactionId && (
              <p className="transaction-id">
                Transaction ID: <strong>{paymentResult.transactionId}</strong>
              </p>
            )}
            <div className="modal-actions">
              <button 
                className="modal-primary-btn"
                onClick={handleSuccessContinue}
              >
                List Your Product Now
              </button>
              <button 
                className="modal-secondary-btn"
                onClick={() => setShowSuccessModal(false)}
              >
                Stay on Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="modal-overlay">
          <div className="modal-content error-modal">
            <div className="modal-icon">❌</div>
            <h2>Payment Failed</h2>
            <p>{paymentResult?.error || 'Something went wrong with your payment.'}</p>
            <div className="modal-actions">
              <button 
                className="modal-primary-btn"
                onClick={handleErrorRetry}
              >
                Try Payment Again
              </button>
              <button 
                className="modal-secondary-btn"
                onClick={handleErrorChooseDifferent}
              >
                Choose Different Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;