import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthContext } from '../pages/AuthContext'; // FIXED: Use AuthContext
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../pages/firebase'; // FIXED: Consistent import path

// SIMPLIFIED password validation
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
  
  // FIXED: Use AuthContext for signup
  const { signup, loginWithGoogle, error, clearError, loading } = useContext(AuthContext);

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
        // Save additional user data to Firestore
        const userData = {
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.userName,
          email: data.email,
          newsletter: data.newsletter,
          createdAt: new Date().toISOString(),
        };

        // FIXED: Get current user from AuthContext instead of auth.currentUser
        const { user } = useContext(AuthContext);
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
        // Google signup successful - user data is handled in AuthContext
        setIsSuccess(true);
        setTimeout(() => navigate("/home"), 1500);
      }
    } catch (error) {
      console.error('Google signup error:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Your Account</h2>
        
        {error && <div className="auth-error">{error}</div>}
        {isSuccess && <div className="auth-success">Account created successfully! Redirecting...</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="name-fields">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input 
                id="firstName"
                type="text" 
                placeholder="John"
                {...register("firstName")} 
                className={errors.firstName ? 'input-error' : ''}
                disabled={loading}
              />
              {errors.firstName && <span className="error-message">{errors.firstName.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input 
                id="lastName"
                type="text" 
                placeholder="Doe"
                {...register("lastName")} 
                className={errors.lastName ? 'input-error' : ''}
                disabled={loading}
              />
              {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="userName">Username</label>
            <input 
              id="userName"
              type="text" 
              placeholder="johndoe123"
              {...register("userName")} 
              className={errors.userName ? 'input-error' : ''}
              disabled={loading}
            />
            {errors.userName && <span className="error-message">{errors.userName.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              placeholder="john@example.com"
              {...register("email")} 
              className={errors.email ? 'input-error' : ''}
              disabled={loading}
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                {...register("password")}
                className={errors.password ? 'input-error' : ''}
                disabled={loading}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                disabled={loading}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              className={errors.confirmPassword ? 'input-error' : ''}
              disabled={loading}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input type="checkbox" {...register("terms")} disabled={loading} />
              <span>I accept the <Link to="/termsOfUse" className="terms-link">Terms and Conditions</Link></span>
            </label>
            {errors.terms && <span className="error-message">{errors.terms.message}</span>}
          </div>

          <div className="form-group">
            <label className="newsletter-label">Would you like to receive our weekly newsletter?</label>
            <p className="newsletter-subtext">We won't spam. Just helpful reminders and updates.</p>
            
            <div className="radio-group">
              <label>
                <input type="radio" value="yes" {...register("newsletter")} disabled={loading} />
                <span>Yes, I'd love helpful reminders!</span>
              </label>
              <label>
                <input type="radio" value="no" {...register("newsletter")} disabled={loading} />
                <span>No thanks, not right now.</span>
              </label>
            </div>
            {errors.newsletter && <span className="error-message">{errors.newsletter.message}</span>}
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={!isValid || loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button 
          onClick={handleGoogleSignup}
          className="google-btn"
          disabled={loading}
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="google-icon"
          />
          {loading ? 'Signing up...' : 'Sign up with Google'}
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;