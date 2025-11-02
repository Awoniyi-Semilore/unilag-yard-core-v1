import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import AllProduct from './pages/AllProduct';
import Header from './component/Header';
import Footer from './component/Footer';
import Login from './pages/Login/Login';
import Signup from './pages/SignUp';
import HowItWorks from './pages/HowItWorks';
import { AuthContext } from './pages/AuthContext'; // FIXED: Import AuthContext
import ForgottenPassword from './pages/ForgottenPassword';
import About from './pages/About';
import Contact from './pages/Contact';
import TermsOfUse from './pages/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy';
import GuestHome from './pages/GuestHome';
import ProductDetail from './pages/ProductDetail/ProductDetail';

function Layout({ children }) {
  const location = useLocation();
  const hideHeaderFooterOn = ['/login', '/signup', '/forgottenpassword']; // ADDED: forgottenpassword
  const hideUI = hideHeaderFooterOn.includes(location.pathname);
  const { user } = useContext(AuthContext);

  return (
    <>
      {!hideUI && <Header user={user} />}
      <main>{children}</main>
      {!hideUI && <Footer />}
    </>
  );
}

function App() {
  const { user, loading } = useContext(AuthContext);

  // FIXED: Better loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={!user ? <LandingPage /> : <Navigate to="/home" replace />} // ADDED: replace prop
      />
      <Route
        path="/home"
        element={
          user ? <Layout><Home /></Layout> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/addProduct"
        element={
          user ? <Layout><AddProduct /></Layout> : <Navigate to="/login" replace />
        }
      />
      {/* FIXED: Made these routes accessible without auth */}
      <Route path="/allProduct" element={<Layout><AllProduct /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/termsOfUse" element={<Layout><TermsOfUse /></Layout>} />
      <Route path="/privacyPolicy" element={<Layout><PrivacyPolicy /></Layout>} />
      <Route path="/howItWorks" element={<Layout><HowItWorks /></Layout>} />
      
      {/* Auth routes */}
      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to="/home" replace />} // FIXED: Redirect if already logged in
      />
      <Route 
        path="/signup" 
        element={!user ? <Signup /> : <Navigate to="/home" replace />} // FIXED: Redirect if already logged in
      />
      <Route 
        path="/forgottenpassword" // FIXED: Corrected path
        element={!user ? <ForgottenPassword /> : <Navigate to="/home" replace />}
      />
      
      <Route path="/guest-home" element={<GuestHome />} />
      <Route 
        path='/product/:productId' 
        element={
          <Layout>
            <ProductDetail />
          </Layout>
        } 
      />
      
      {/* FIXED: Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;