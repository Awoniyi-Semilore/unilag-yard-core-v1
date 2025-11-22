import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, Spinner } from '@chakra-ui/react';

// Import ErrorBoundary
import ErrorBoundary from "./component/ErrorBoundary.jsx";

// Context imports - USE CONSISTENT IMPORT
import { AuthContext } from './Hooks/useAuth.jsx';

// Page imports
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import AllProduct from './pages/AllProduct';
import Header from './component/Header'; // Use Header for both cases
import Footer from './component/Footer';
import Login from './pages/Login/Login';
import Signup from './pages/SignUp';
import HowItWorks from './component/legal/HowItWorks.jsx';
import ForgottenPassword from './pages/ForgottenPassword';
import About from './pages/About';
import TermsOfUse from './pages/TermsOfUse';
import GuestHome from './pages/GuestHome';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import SellerVerification from './pages/SellerVerification';
import Payment from './component/Payment/Payment';
import SubmitProduct from './pages/submit/submitProduct';
import SavedProducts from './pages/SavedProducts.jsx';
import Messages from './component/Messages.jsx';
import Profile from './pages/UserProfile.jsx';
import FAQPage from './component/legal/FAQPage.jsx';
import SafetyTips from './component/legal/SafetyTips.jsx';
import TermsAndCondition from './component/legal/TermsAndCondition.jsx';
import Contact from './component/legal/Contact.jsx';
import PrivacyPolicy from './component/legal/PrivacyPolicy.jsx';

// Import missing components
import AdminDashboard from './pages/AdminDashboard';
import Notification from './component/Notification';

// Custom hook for admin auth
const useAdminAuth = () => {
  // Implement your admin authentication logic here
  return { isAdmin: false, loading: false };
};

// AdminRoute component
const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAdminAuth();
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }
  
  return isAdmin ? children : <Navigate to="/" replace />;
};

// Layout component - FIXED VERSION
function Layout({ children }) {
  const location = useLocation();
  const authContext = useContext(AuthContext);
  
  // Safety check for AuthContext
  if (!authContext) {
    console.error('AuthContext is not available in Layout component');
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Spinner size="xl" />
        <Box ml={4}>Loading authentication...</Box>
      </Box>
    );
  }
  
  const { user } = authContext;
  
  const hideHeaderFooterOn = ['/login', '/signup'];
  const hideUI = hideHeaderFooterOn.includes(location.pathname);

  return (
    <>
      {!hideUI && <Header user={user} />}
      <main>{children}</main>
      {!hideUI && <Footer />}
    </>
  );
}

// Main App component - FIXED VERSION
function App() {
  const authContext = useContext(AuthContext);

  // Safety check for AuthContext
  if (!authContext) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Spinner size="xl" />
        <Box ml={4}>Authentication service loading...</Box>
      </Box>
    );
  }

  const { user, loading, error } = authContext;

  // Global error listener
  useEffect(() => {
    const handleGlobalError = (event) => {
      console.error('Global Error:', event.error);
      console.error('Error Stack:', event.error?.stack);
    };

    const handleUnhandledRejection = (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Spinner size="xl" />
        <Box ml={4}>Loading app...</Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh" flexDirection="column">
        <Box color="red.500" fontSize="lg" mb={4}>
          Authentication Error: {error}
        </Box>
        <button onClick={() => window.location.reload()}>Retry</button>
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path="/"
          element={!user ? <LandingPage /> : <Navigate to="/home" />}
        />
        <Route
          path="/home"
          element={
            user ? <Layout><Home /></Layout> : <Navigate to="/login" />
          }
        />
        <Route
          path="/addProduct"
          element={
            user ? <Layout><AddProduct /></Layout> : <Navigate to="/login" />
          }
        />
        
        {/* Payment Routes */}
        <Route
          path="/payment"
          element={
            user ? <Layout><Payment /></Layout> : <Navigate to="/login" />
          }
        />
        <Route
          path="/submit-product"
          element={
            user ? <Layout><SubmitProduct /></Layout> : <Navigate to="/login" />
          }
        />
        
        {/* Admin Route */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <Layout><AdminDashboard /></Layout>
            </AdminRoute>
          } 
        />
        
        {/* Public Routes */}
        <Route path="/allProduct" element={<Layout><AllProduct /></Layout>} />
        <Route path="/termsAndCondition" element={<Layout><TermsAndCondition /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/faq-page" element={<Layout><FAQPage /></Layout>} />
        <Route path="/how-it-works" element={<Layout><HowItWorks /></Layout>} />
        <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
        <Route path="/safety-tips" element={<Layout><SafetyTips /></Layout>} />
        
        {/* Protected Routes */}
        <Route
          path="/messages"
          element={
            user ? <Layout><Messages /></Layout> : <Navigate to="/login" />
          }
        />
        <Route
          path="/notifications"
          element={
            user ? <Layout><Notification /></Layout> : <Navigate to="/login" />
          }
        />
        <Route
          path="/my-profile"
          element={
            user ? <Layout><Profile /></Layout> : <Navigate to="/login" />
          }
        />
        <Route
          path="/saved-products"
          element={
            user ? <Layout><SavedProducts /></Layout> : <Navigate to="/login" />
          }
        />
        
        {/* Auth Routes */}
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/termsOfUse" element={<Layout><TermsOfUse /></Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/guest-home" element={<GuestHome />} />
        <Route path="/ForgottenPassword" element={<ForgottenPassword />} />
        <Route path="/howItWorks" element={<Layout><HowItWorks /></Layout>} />
        
        {/* Product Detail Route */}
        <Route 
          path='/product/:productId' 
          element={
            <Layout>
              <ProductDetail />
            </Layout>
          } 
        />
        
        {/* Seller Verification */}
        <Route
          path="/seller-verification"
          element={
            user ? <Layout><SellerVerification /></Layout> : <Navigate to="/login" />
          }
        />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;