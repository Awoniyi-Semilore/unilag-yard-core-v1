import React, { useState, useContext } from 'react';
import '../Login/Login.css';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Shield, Sparkles } from 'lucide-react';
import '../Login/Login.css'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { login, loginWithGoogle, error, clearError } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/home');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    clearError();
    setLoading(true);

    try {
      const result = await loginWithGoogle();
      if (result.success) {
        navigate('/home');
      }
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-background">
      {/* Animated Background Elements */}
      <div className="auth-background-elements">
        <motion.div 
          className="floating-shape shape-1"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="floating-shape shape-2"
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1 
          }}
        />
      </div>

      <motion.div 
        className="auth-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="auth-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Header Section */}
          <motion.div 
            className="auth-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="auth-icon">
              <Shield size={32} />
              <motion.div
                className="sparkle"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatDelay: 2 
                }}
              >
                <Sparkles size={16} />
              </motion.div>
            </div>
            <h2>Welcome Back to Unilag Yard</h2>
            <p>Connect with campus mates and discover amazing deals</p>
          </motion.div>

          <form onSubmit={handleLogin} className="auth-form">
            {/* Email Field */}
            <motion.div 
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="input-with-icon">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  placeholder="Enter your student email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="modern-input"
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div 
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="input-with-icon">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="modern-input"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {error}
              </motion.div>
            )}

            {/* Forgot Password */}
            <motion.div 
              className="form-options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/forgottenpassword" className="forgot-password">
                Forgot your password?
              </Link>
            </motion.div>

            {/* Login Button */}
            <motion.button 
              type="submit" 
              disabled={loading}
              className="primary-btn"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                'Login to Your Account'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div 
            className="auth-divider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <span>or continue with</span>
          </motion.div>

          {/* Google Login */}
          <motion.button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="google-btn"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <img 
              src="https://www.google.com/favicon.ico" 
              alt="Google" 
              className="google-icon" 
            />
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </motion.button>

          {/* Sign Up Link */}
          <motion.div 
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="auth-link">
                Join Unilag Yard
              </Link>
            </p>
          </motion.div>

          {/* Security Badge */}
          <motion.div 
            className="security-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1 }}
          >
            <Shield size={16} />
            <span>100% Secure • Verified Students Only</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;