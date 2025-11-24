// hooks/useAuth.jsx - FIXED VERSION
import { useState, useEffect, createContext, useContext } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '../firebase'; // ADD db import
import { doc, setDoc, getDoc } from 'firebase/firestore'; // ADD Firestore imports

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ADD these helper functions since they're missing from auth.js
const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    }
    return { success: false, error: 'User profile not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const createUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

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
            const basicProfile = {
              ...userData,
              verificationStatus: 'unverified',
              role: 'user',
              createdAt: new Date().toISOString()
            };
            setUserProfile(basicProfile);
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

  // Login with email and password
  const login = async (email, password) => {
    try {
      setError(null);
      setAuthLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user profile after login
      const profileResult = await getUserProfile(userCredential.user.uid);
      if (profileResult.success) {
        setUserProfile(profileResult.data);
      }
      
      return { success: true };
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error.code);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign up with email and password
  const signup = async (email, password, displayName = "") => {
    try {
      setError(null);
      setAuthLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update profile with display name if provided
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      // Create user profile in Firestore
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: displayName || userCredential.user.email.split('@')[0],
        photoURL: userCredential.user.photoURL || '',
        verificationStatus: 'unverified',
        role: 'user',
        createdAt: new Date().toISOString()
      };

      await createUserProfile(userCredential.user.uid, userData);
      setUserProfile(userData);

      return { success: true };
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error.code);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setAuthLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      setError(null);
      setAuthLoading(true);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if user profile exists, if not create one
      const profileResult = await getUserProfile(userCredential.user.uid);
      if (!profileResult.success) {
        const userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL || '',
          verificationStatus: 'unverified',
          role: 'user',
          createdAt: new Date().toISOString()
        };
        await createUserProfile(userCredential.user.uid, userData);
        setUserProfile(userData);
      } else {
        setUserProfile(profileResult.data);
      }

      return { success: true };
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error.code);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      return { success: true };
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error.code);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setError(null);
      setAuthLoading(true);
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error.code);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setAuthLoading(false);
    }
  };

  // Clear error
  const clearError = () => setError(null);

  // Helper function for user-friendly error messages
  const getAuthErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/invalid-email': 'Invalid email address',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/email-already-in-use': 'An account with this email already exists',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/network-request-failed': 'Network error. Please check your connection',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
      'auth/popup-closed-by-user': 'Sign in was cancelled',
      'auth/operation-not-allowed': 'This sign-in method is not enabled',
      'auth/invalid-credential': 'Invalid login credentials',
    };

    return errorMessages[errorCode] || 'An unexpected error occurred';
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    authLoading,
    isLoggedIn: !!user,
    login,
    signup,
    logout,
    loginWithGoogle,
    resetPassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};