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
import { AuthContext } from './pages/AuthContext';
import ForgottenPassword from './pages/ForgottenPassword';
import About from './pages/About';
import Contact from './pages/Contact';
import TermsOfUse from './pages/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy';
import GuestHome from './pages/GuestHome';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import SellerVerification from './pages/SellerVerification';
import Payment from './component/Payment/Payment';
import SubmitProduct from './pages/submit/submitProduct';
import SavedProducts from './pages/SavedProducts.jsx';

function Layout({ children }) {
  const location = useLocation();
  const hideHeaderFooterOn = ['/login', '/signup'];
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

  if (loading) return null;

  return (
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
      
      {/* ADD PAYMENT ROUTES */}
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
      
      <Route path="/allProduct" element={<Layout><AllProduct /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/termsOfUse" element={<Layout><TermsOfUse /></Layout>} />
      <Route path="/privacyPolicy" element={<Layout><PrivacyPolicy /></Layout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/guest-home" element={<GuestHome />} />
      <Route path="/saved-products" element={<SavedProducts />} />
      <Route path="/ForgottenPassword" element={<ForgottenPassword />} />
      <Route path="/howItWorks" element={<Layout><HowItWorks /></Layout>} />
      <Route 
        path='/product/:productId' 
        element={
          <Layout>
            <ProductDetail />
          </Layout>
        } 
      />
    </Routes>
  );
}

export default App;