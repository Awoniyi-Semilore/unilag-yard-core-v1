import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './index';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Error message mapping
const authErrorMessages = {
  'auth/invalid-email': 'Invalid email address format.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/popup-closed-by-user': 'Sign in was cancelled.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled.',
};

// Get user-friendly error message
const getAuthErrorMessage = (errorCode) => {
  return authErrorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
};

// Sign up new user
export const signUp = async (email, password, userData = {}) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: userData.displayName || user.email.split('@')[0],
      photoURL: userData.photoURL || '',
      verificationStatus: 'unverified',
      role: 'user',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      ...userData
    });

    // Send email verification
    await sendEmailVerification(user);

    return { 
      success: true, 
      user: {
        uid: user.uid,
        email: user.email,
        displayName: userData.displayName || user.email.split('@')[0],
        photoURL: userData.photoURL || ''
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error.code)
    };
  }
};

// Sign in user
export const signIn = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login time
    await setDoc(doc(db, 'users', user.uid), {
      lastLogin: serverTimestamp()
    }, { merge: true });

    return { 
      success: true, 
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error.code)
    };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const { user } = await signInWithPopup(auth, googleProvider);
    
    // Create or update user profile
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      verificationStatus: 'unverified',
      role: 'user',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    }, { merge: true });

    return { 
      success: true, 
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
    };
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error.code)
    };
  }
};

// Sign out user
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error.code)
    };
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error.code)
    };
  }
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    await setDoc(doc(db, 'users', userId), updates, { merge: true });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update profile. Please try again.'
    };
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return {
        success: true,
        data: { id: userDoc.id, ...userDoc.data() }
      };
    }
    return {
      success: false,
      error: 'User profile not found'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch user profile'
    };
  }
};