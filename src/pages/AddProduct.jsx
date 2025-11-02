import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PlanHero from './PlanHero/PlanHero.jsx';
import '../component/CSS/AddProduct.css';

const AddProduct = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
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

  return (
    <div className="add-product-page">
      <PlanHero/>
      
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
            <Link to='/payment/standard' className='plan-btn'>Get Started</Link>
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
            <Link to='/payment/featured' className='plan-btn'>Get Started</Link>
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
            <Link to='/payment/pro' className='plan-btn'>Get Started</Link>
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
            <Link to='/payment/premium' className='plan-btn primary'>Get Started</Link>
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
  )
}

export default AddProduct