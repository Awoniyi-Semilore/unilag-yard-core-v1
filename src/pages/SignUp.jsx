import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { auth } from '../pages/firebase';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../pages/firebase';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  userName: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .test('password-strength', 'Password must meet requirements', function (value) {
      const errors = [];
      if (!value) return this.createError({ message: 'Password is required' });

      if (value.length < 6) {
        errors.push('Minimum 6 characters');
      }
      if (!/[A-Z]/.test(value)) {
        errors.push('At least one uppercase letter');
      }
      if (!/[a-z]/.test(value)) {
        errors.push('At least one lowercase letter');
      }
      if (! /[!@#$%^&*(),.?":{}|<> ]/ .test(value)) {
        errors.push('At least one symbol');
      }

      return errors.length
        ? this.createError({ message: errors.join(', ') })
        : true;
  }),
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
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState({
    guest: false,
    login: false
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading({...isLoading, login: true});
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: data.userName });

      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.userName,
        email: data.email,
        newsletter: data.newsletter,
      };

      await setDoc(doc(db, "users", user.uid), userData);

      localStorage.setItem("user", JSON.stringify(userData));
      reset();
      setIsSuccess(true);
      setTimeout(() => navigate("/home"), 1500);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMsg("This email is already in use. Please login instead.");
      } else {
        setErrorMsg(error.message);
      }
    } finally {
      setIsLoading({...isLoading, login: false});
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setIsLoading({...isLoading, guest: true});
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userData = {
        username: user.displayName || "Google User",
        email: user.email,
        photoURL: user.photoURL || null,
        newsletter: "no",
      };

      await setDoc(doc(db, "users", user.uid), userData);

      localStorage.setItem("user", JSON.stringify(userData));
      setIsSuccess(true);
      setTimeout(() => navigate("/home"), 1500);
    } catch (error) {
      console.error("Google sign-up failed:", error);
      setErrorMsg("Google sign-up failed. Try again.");
    } finally {
      setIsLoading({...isLoading, guest: false});
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Your Account</h2>
        
        {errorMsg && <div className="auth-error">{errorMsg}</div>}
        {isSuccess && <div className="auth-success">Account created successfully! Redirecting...</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input 
              id="firstName"
              type="text" 
              placeholder="John"
              {...register("firstName")} 
              className={errors.firstName ? 'input-error' : ''}
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
            />
            {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="userName">Username</label>
            <input 
              id="userName"
              type="text" 
              placeholder="johndoe123"
              {...register("userName")} 
              className={errors.userName ? 'input-error' : ''}
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
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
              <span className="password-hint">(min 6 chars, 1 uppercase, 1 symbol)</span>
            </label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className={errors.password ? 'input-error' : ''}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
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
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={errors.confirmPassword ? 'input-error' : ''}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input type="checkbox" {...register("terms")} />
              <span>I accept the <Link to="/terms" className="terms-link">Terms and Conditions</Link></span>
            </label>
            {errors.terms && <span className="error-message">{errors.terms.message}</span>}
          </div>

          <div className="form-group">
            <label className="newsletter-label">Would you like to receive our weekly newsletter?</label>
            <p className="newsletter-subtext">We won't spam. Just helpful reminders and updates.</p>
            
            <div className="radio-group">
              <label>
                <input type="radio" value="yes" {...register("newsletter")} />
                <span>Yes, I'd love helpful reminders!</span>
              </label>
              <label>
                <input type="radio" value="no" {...register("newsletter")} />
                <span>No thanks, not right now.</span>
              </label>
            </div>
            {errors.newsletter && <span className="error-message">{errors.newsletter.message}</span>}
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={!isValid || isLoading.login}
          >
            {isLoading.login ? (
              <span className="loading-spinner"></span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button 
          onClick={handleGoogleSignup}
          className="google-btn"
          disabled={isLoading.guest}
        >
          <img 
            src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" 
            alt="Google logo" 
            className="google-icon"
          />
          {isLoading.guest ? (
            <span className="loading-spinner"></span>
          ) : (
            'Continue with Google'
          )}
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;