import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ADDED: Navigation
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';

const ForgottenPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); // ADDED: Navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');    

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent! Please check your inbox.');
            // Clear form
            setEmail('');
        } catch (err) {
            setError('Failed to send reset email. Please check your email address.');
            console.error('Password reset error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };
    
    return (
        <div className="form-background">
            <div className="form-container">
                <h2>Reset Your Password</h2>
                <p className="form-subtitle">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
                
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address" 
                        required
                        disabled={isLoading}
                    />
                    <button type='submit' disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                
                {message && <div className="success">{message}</div>} {/* FIXED: Typo */}
                {error && <div className="error">{error}</div>}
                
                <div className="form-footer">
                    <button 
                        onClick={handleBackToLogin}
                        className="back-to-login-btn"
                        disabled={isLoading}
                    >
                        ← Back to Login
                    </button>
                    <p className="form-switch-text">
                        Don't have an account? <Link to="/signup">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgottenPassword;