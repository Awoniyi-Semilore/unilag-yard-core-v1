import React, { useState, useContext } from 'react';
import '../Login/Login.css';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext'; // FIXED: Consistent import path

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // FIXED: Use AuthContext instead of direct Firebase
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
      // Error is already handled in AuthContext
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
      // Error is already handled in AuthContext
      console.error('Google login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-background">
      <div className="form-container">
        <h2>Login to Your Account</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          {/* FIXED: Use error from AuthContext */}
          {error && <div className="error">{error}</div>}

          <Link to="/forgottenpassword" className='form-switch-text-a'>
            Forgot your password?
          </Link>

          <p className="form-switch-text">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="google-login-btn"
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="google-img" 
          />
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
}

export default Login;