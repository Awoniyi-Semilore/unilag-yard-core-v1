import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthContext } from '../Hooks/useAuth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../pages/firebase';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Shield, Sparkles, CheckCircle } from 'lucide-react';
import './Login/Login.css'

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  userName: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
  terms: yup.boolean().oneOf([true], 'You must accept the terms'),
  newsletter: yup.string().required('Please select a newsletter option'),
});

function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { signup, loginWithGoogle, error, clearError, loading, user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    clearError();
    
    try {
      const result = await signup(data.email, data.password, data.userName);
      
      if (result.success) {
        const userData = {
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.userName,
          email: data.email,
          newsletter: data.newsletter,
          createdAt: new Date().toISOString(),
        };

        if (user) {
          await setDoc(doc(db, "users", user.uid), userData);
        }

        reset();
        setIsSuccess(true);
        setTimeout(() => navigate("/home"), 1500);
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const handleGoogleSignup = async () => {
    clearError();
    
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => navigate("/home"), 1500);
      }
    } catch (error) {
      console.error('Google signup error:', error);
    }
  };

  return (
    <div className="auth-background">
      {/* Animated Background Elements */}
      <div className="auth-background-elements">
        <motion.div 
          className="floating-shape shape-3"
          animate={{ 
            y: [0, -25, 0],
            rotate: [0, 8, 0]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="floating-shape shape-4"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5 
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
          className="auth-card signup-card"
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
              <User size={32} />
              <motion.div
                className="sparkle"
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  repeatDelay: 3 
                }}
              >
                <Sparkles size={16} />
              </motion.div>
            </div>
            <h2>Join Unilag Yard</h2>
            <p>Start trading with verified campus students</p>
          </motion.div>

          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          {isSuccess && (
            <motion.div 
              className="success-message"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle size={20} />
              Account created successfully! Redirecting...
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            {/* Name Fields */}
            <motion.div 
              className="name-fields"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input 
                    id="firstName"
                    type="text" 
                    placeholder="John"
                    {...register("firstName")} 
                    className={errors.firstName ? 'input-error modern-input' : 'modern-input'}
                    disabled={loading}
                  />
                </div>
                {errors.firstName && <span className="error-text">{errors.firstName.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input 
                    id="lastName"
                    type="text" 
                    placeholder="Doe"
                    {...register("lastName")} 
                    className={errors.lastName ? 'input-error modern-input' : 'modern-input'}
                    disabled={loading}
                  />
                </div>
                {errors.lastName && <span className="error-text">{errors.lastName.message}</span>}
              </div>
            </motion.div>

            {/* Username */}
            <motion.div 
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="userName">Username</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input 
                  id="userName"
                  type="text" 
                  placeholder="johndoe123"
                  {...register("userName")} 
                  className={errors.userName ? 'input-error modern-input' : 'modern-input'}
                  disabled={loading}
                />
              </div>
              {errors.userName && <span className="error-text">{errors.userName.message}</span>}
            </motion.div>

            {/* Email */}
            <motion.div 
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="email">Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input 
                  id="email"
                  type="email" 
                  placeholder="john@gmail.com"
                  {...register("email")} 
                  className={errors.email ? 'input-error modern-input' : 'modern-input'}
                  disabled={loading}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email.message}</span>}
            </motion.div>

            {/* Password */}
            <motion.div 
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  {...register("password")}
                  className={errors.password ? 'input-error modern-input' : 'modern-input'}
                  disabled={loading}
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
              {errors.password && <span className="error-text">{errors.password.message}</span>}
            </motion.div>

            {/* Confirm Password */}
            <motion.div 
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? 'input-error modern-input' : 'modern-input'}
                  disabled={loading}
                />
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message}</span>}
            </motion.div>

            {/* Terms */}
            <motion.div 
              className="form-group checkbox-group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <label className="checkbox-label">
                <input type="checkbox" {...register("terms")} disabled={loading} />
                <span className="checkmark"></span>
                I accept the <Link to="/termsAndCondition" className="terms-link">Terms and Conditions</Link>
              </label>
              {errors.terms && <span className="error-text">{errors.terms.message}</span>}
            </motion.div>

            {/* Newsletter */}
            <motion.div 
              className="form-group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <label className="newsletter-label">Campus Updates</label>
              <p className="newsletter-subtext">Get weekly deals and campus news</p>
              
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" value="yes" {...register("newsletter")} disabled={loading} />
                  <span className="radio-checkmark"></span>
                  Yes, keep me updated!
                </label>
                <label className="radio-label">
                  <input type="radio" value="no" {...register("newsletter")} disabled={loading} />
                  <span className="radio-checkmark"></span>
                  No thanks
                </label>
              </div>
              {errors.newsletter && <span className="error-text">{errors.newsletter.message}</span>}
            </motion.div>

            {/* Submit Button */}
            <motion.button 
              type="submit" 
              className="primary-btn"
              disabled={!isValid || loading}
              whileHover={{ scale: (!isValid || loading) ? 1 : 1.02 }}
              whileTap={{ scale: (!isValid || loading) ? 1 : 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                'Create Campus Account'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div 
            className="auth-divider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <span>or join with</span>
          </motion.div>

          {/* Google Signup */}
          <motion.button
            onClick={handleGoogleSignup}
            className="google-btn"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            <img 
              src="https://www.google.com/favicon.ico" 
              alt="Google" 
              className="google-icon"
            />
            {loading ? 'Signing up...' : 'Sign up with Google'}
          </motion.button>

          {/* Login Link */}
          <motion.div 
            className="auth-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <p>
              Already part of Unilag Yard?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </motion.div>

          {/* Security Badge */}
          <motion.div 
            className="security-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
          >
            <Shield size={16} />
            <span>Verified Student Community • Secure Trading</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default SignUp;