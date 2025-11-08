import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import PlanHero from './PlanHero/PlanHero.jsx';
import SellerVerification from '../pages/SellerVerification.jsx'; // Adjust path as needed
import '../component/CSS/AddProduct.css';

const AddProduct = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const [userStatus, setUserStatus] = useState({
    verificationStatus: 'none' // none, pending, approved, rejected
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        navigate('/login');
        return;
      }

      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const status = userData.verificationStatus || 'none';
        
        setUserStatus({
          verificationStatus: status
        });

        // Show verification popup if user is not verified
        if (status === 'none' || status === 'rejected') {
          setShowVerification(true);
        }
      } else {
        // New user - show verification
        setShowVerification(true);
      }
    } catch (error) {
      console.error('Error checking user status:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handlePlanSelection = (plan) => {
    navigate('/payment', { state: { plan } });
  };

  const handleVerificationSubmitted = () => {
    setUserStatus(prev => ({ 
      ...prev, 
      verificationStatus: 'pending' 
    }));
    setShowVerification(false);
  };

  const faqItems = [
    {
      question: "How long does my listing stay active?",
      answer: "Every listing is active for 30 days from the date it's published. You can renew it before it expires."
    },
    {
      question: "What does 'Featured' mean?",
      answer: "Featured listings are prominently displayed on the Unilag Yard homepage, giving your item significantly more visibility."
    },
    {
      question: "How do I meet a buyer safely?",
      answer: "For your safety, all transactions should be completed on campus in public, well-lit areas like the library steps or faculty building entrances."
    },
    {
      question: "What's the difference between 'Pro' and 'Premium'?",
      answer: "Both allow unlimited posts for one month. The Premium plan includes the 'Featured' boost on every item you list, while the Pro plan does not."
    }
  ];

  const planFeatures = [
    { name: "List 1 Product", standard: true, featured: true, pro: false, premium: false },
    { name: "Visible for 30 Days", standard: true, featured: true, pro: true, premium: true },
    { name: "Featured on Homepage", standard: false, featured: true, pro: false, premium: true },
    { name: "Unlimited Posts", standard: false, featured: false, pro: true, premium: true }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="add-product-page">
      {/* Verification Pop-up Modal */}
      {showVerification && (
        <SellerVerification 
          onSubmitted={handleVerificationSubmitted}
        />
      )}

      {/* Main AddProduct Content */}
      <PlanHero/>
      
      {/* Status Banner for Pending Verification */}
      {userStatus.verificationStatus === 'pending' && (
        <div className="verification-banner pending">
          <div className="banner-content">
            <span className="banner-icon">⏳</span>
            <div className="banner-text">
              <h3>Verification Under Review</h3>
              <p>Your documents are being reviewed. You can still list items while we verify your UNILAG status.</p>
            </div>
          </div>
        </div>
      )}

      <div className='card-listings'>
        {/* Standard Plan */}
        <div className='card-listing'>
          <h5>Standard</h5>
          <h4>₦500</h4>
          <h2>One Time Payment</h2>

          <div className="features-list">
            {planFeatures.map((feature, index) => (
              <div key={index} className="feature-item">
                <span className={`feature-icon ${feature.standard ? 'included' : 'excluded'}`}>
                  {feature.standard ? '✓' : '✗'}
                </span>
                <h3>{feature.name}</h3>
              </div>
            ))}
            <button 
              className='plan-btn'
              onClick={() => handlePlanSelection('standard')}
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Featured Plan */}
        <div className='card-listing'>
          <h5>Featured</h5>
          <h4>₦1,000</h4>
          <h2>One Time Payment</h2>
          
          <div className="features-list">
            {planFeatures.map((feature, index) => (
              <div key={index} className="feature-item">
                <span className={`feature-icon ${feature.featured ? 'included' : 'excluded'}`}>
                  {feature.featured ? '✓' : '✗'}
                </span>
                <h3>{feature.name}</h3>
              </div>
            ))}
            <button 
              className='plan-btn'
              onClick={() => handlePlanSelection('featured')}
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Pro Plan */}
        <div className='card-listing'>
          <h5>Pro</h5>
          <h4>₦1,500</h4>
          <h2>Per Month</h2>

          <div className="features-list">
            {planFeatures.map((feature, index) => (
              <div key={index} className="feature-item">
                <span className={`feature-icon ${feature.pro ? 'included' : 'excluded'}`}>
                  {feature.pro ? '✓' : '✗'}
                </span>
                <h3>{feature.name}</h3>
              </div>
            ))}
            <button 
              className='plan-btn'
              onClick={() => handlePlanSelection('pro')}
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Premium Plan */}
        <div className='card-listing popular'>
          <div className="popular-badge">MOST POPULAR</div>
          <h5>Premium</h5>
          <h4>₦2,000</h4>
          <h2>Per Month</h2>

          <div className="features-list">
            {planFeatures.map((feature, index) => (
              <div key={index} className="feature-item">
                <span className={`feature-icon ${feature.premium ? 'included' : 'excluded'}`}>
                  {feature.premium ? '✓' : '✗'}
                </span>
                <h3>{feature.name}</h3>
              </div>
            ))}
            <button 
              className='plan-btn'
              onClick={() => handlePlanSelection('premium')}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="faq-section">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqItems.map((item, index) => (
            <div key={index} className="faq-item">
              <div 
                className="faq-question"
                onClick={() => toggleAccordion(index)}
              >
                <h3>{item.question}</h3>
                <span className={`accordion-icon ${activeIndex === index ? 'active' : ''}`}>
                  {activeIndex === index ? '−' : '+'}
                </span>
              </div>
              <div className={`faq-answer ${activeIndex === index ? 'active' : ''}`}>
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;







// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import PlanHero from './PlanHero/PlanHero.jsx';
// import '../component/CSS/AddProduct.css';

// const AddProduct = () => {
//   const [activeIndex, setActiveIndex] = useState(null);

//   const navigate = useNavigate(); // ADD THIS
//   const toggleAccordion = (index) => {
//     setActiveIndex(activeIndex === index ? null : index);
//   };

//   const faqItems = [
//     {
//       question: "How long does my listing stay active?",
//       answer: "Every listing is active for 30 days from the date it's published. You can renew it before it expires."
//     },
//     {
//       question: "What does 'Featured' mean?",
//       answer: "Featured listings are prominently displayed on the Unilag Yard homepage, giving your item significantly more visibility."
//     },
//     {
//       question: "How do I meet a buyer safely?",
//       answer: "For your safety, all transactions should be completed on campus in public, well-lit areas like the library steps or faculty building entrances."
//     },
//     {
//       question: "What's the difference between 'Pro' and 'Premium'?",
//       answer: "Both allow unlimited posts for one month. The Premium plan includes the 'Featured' boost on every item you list, while the Pro plan does not."
//     }
//   ];

//   const planFeatures = [
//     { name: "List 1 Product", standard: true, featured: true, pro: false, premium: false },
//     { name: "Visible for 30 Days", standard: true, featured: true, pro: true, premium: true },
//     { name: "Featured on Homepage", standard: false, featured: true, pro: false, premium: true },
//     { name: "Unlimited Posts", standard: false, featured: false, pro: true, premium: true }
//   ];

//   return (
//     <div className="add-product-page">
//       <PlanHero/>
      
//       <div className='card-listings'>
//         {/* Standard Plan */}
//         <div className='card-listing'>
//           <h5>Standard</h5>
//           <h4>₦500</h4>
//           <h2>One Time Payment</h2>

//           <div className="features-list">
//             {planFeatures.map((feature, index) => (
//               <div key={index} className="feature-item">
//                 <span className={`feature-icon ${feature.standard ? 'included' : 'excluded'}`}>
//                   {feature.standard ? '✓' : '✗'}
//                 </span>
//                 <h3>{feature.name}</h3>
//               </div>
//             ))}
//             <button 
//               className='plan-btn'
//               onClick={() => navigate('/payment', { state: { plan: 'standard' } })}
//             >
//               Get Started
//             </button>
//           </div>
//         </div>

//         {/* Featured Plan */}
//         <div className='card-listing'>
//           <h5>Featured</h5>
//           <h4>₦1,000</h4>
//           <h2>One Time Payment</h2>
          
//           <div className="features-list">
//             {planFeatures.map((feature, index) => (
//               <div key={index} className="feature-item">
//                 <span className={`feature-icon ${feature.featured ? 'included' : 'excluded'}`}>
//                   {feature.featured ? '✓' : '✗'}
//                 </span>
//                 <h3>{feature.name}</h3>
//               </div>
//             ))}
//             <button 
//               className='plan-btn'
//               onClick={() => navigate('/payment', { state: { plan: 'featured' } })}
//             >
//               Get Started
//             </button>
//           </div>
//         </div>

//         {/* Pro Plan */}
//         <div className='card-listing'>
//           <h5>Pro</h5>
//           <h4>₦1,500</h4>
//           <h2>Per Month</h2>

//           <div className="features-list">
//             {planFeatures.map((feature, index) => (
//               <div key={index} className="feature-item">
//                 <span className={`feature-icon ${feature.pro ? 'included' : 'excluded'}`}>
//                   {feature.pro ? '✓' : '✗'}
//                 </span>
//                 <h3>{feature.name}</h3>
//               </div>
//             ))}
//             <button 
//               className='plan-btn'
//               onClick={() => navigate('/payment', { state: { plan: 'pro' } })}
//             >
//               Get Started
//             </button>
//           </div>
//         </div>

//         {/* Premium Plan */}
//         <div className='card-listing popular'>
//           <div className="popular-badge">MOST POPULAR</div>
//           <h5>Premium</h5>
//           <h4>₦2,000</h4>
//           <h2>Per Month</h2>

//           <div className="features-list">
//             {planFeatures.map((feature, index) => (
//               <div key={index} className="feature-item">
//                 <span className={`feature-icon ${feature.premium ? 'included' : 'excluded'}`}>
//                   {feature.premium ? '✓' : '✗'}
//                 </span>
//                 <h3>{feature.name}</h3>
//               </div>
//             ))}
//             <button 
//               className='plan-btn'
//               onClick={() => navigate('/payment', { state: { plan: 'premium' } })}
//             >
//               Get Started
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* FAQ Accordion Section */}
//       <div className="faq-section">
//         <h2 className="faq-title">Frequently Asked Questions</h2>
//         <div className="faq-list">
//           {faqItems.map((item, index) => (
//             <div key={index} className="faq-item">
//               <div 
//                 className="faq-question"
//                 onClick={() => toggleAccordion(index)}
//               >
//                 <h3>{item.question}</h3>
//                 <span className={`accordion-icon ${activeIndex === index ? 'active' : ''}`}>
//                   {activeIndex === index ? '−' : '+'}
//                 </span>
//               </div>
//               <div className={`faq-answer ${activeIndex === index ? 'active' : ''}`}>
//                 <p>{item.answer}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AddProduct