// hooks/useAuth.jsx - YOUR SINGLE SOURCE OF TRUTH
import { useState, useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { getUserProfile } from '../firebase/auth';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true);
        setError(null);

        if (firebaseUser) {
          // Set basic user info
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified
          };
          setUser(userData);

          // Fetch complete user profile from Firestore
          const profileResult = await getUserProfile(firebaseUser.uid);
          if (profileResult.success) {
            setUserProfile(profileResult.data);
          } else {
            // If no profile exists, create a basic one
            setUserProfile({
              ...userData,
              verificationStatus: 'unverified',
              role: 'user'
            });
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    userProfile,
    loading,
    error,
    isLoggedIn: !!user,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};