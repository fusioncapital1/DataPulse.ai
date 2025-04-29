/**
 * Authentication Service
 * Handles user authentication and management
 */

import { auth, db } from '../firebase-config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from '@firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from '@firebase/firestore';

/**
 * Register a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} displayName - User display name
 * @returns {Promise<Object>} - User credential
 */
export const registerWithEmail = async (email, password, displayName) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, {
      displayName: displayName
    });
    
    // Create user document in Firestore
    await createUserDocument(user, { displayName });
    
    return userCredential;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - User credential
 */
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login timestamp
    const userRef = doc(db, 'users', userCredential.user.uid);
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp()
    });
    
    return userCredential;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

/**
 * Sign in with Google
 * @returns {Promise<Object>} - User credential
 */
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Check if user document exists, create if not
    const userRef = doc(db, 'users', userCredential.user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      await createUserDocument(userCredential.user);
    } else {
      // Update last login timestamp
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp()
      });
    }
    
    return userCredential;
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
};

/**
 * Sign in with GitHub
 * @returns {Promise<Object>} - User credential
 */
export const signInWithGithub = async () => {
  try {
    const provider = new GithubAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Check if user document exists, create if not
    const userRef = doc(db, 'users', userCredential.user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      await createUserDocument(userCredential.user);
    } else {
      // Update last login timestamp
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp()
      });
    }
    
    return userCredential;
  } catch (error) {
    console.error('GitHub sign in error:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (profileData) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Update display name if provided
    if (profileData.displayName) {
      await updateProfile(user, {
        displayName: profileData.displayName
      });
    }
    
    // Update photo URL if provided
    if (profileData.photoURL) {
      await updateProfile(user, {
        photoURL: profileData.photoURL
      });
    }
    
    // Update user document in Firestore
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

/**
 * Update user email
 * @param {string} newEmail - New email address
 * @param {string} password - Current password for verification
 * @returns {Promise<void>}
 */
export const updateUserEmail = async (newEmail, password) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Reauthenticate user before changing email
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    
    // Update email
    await updateEmail(user, newEmail);
    
    // Update user document in Firestore
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      email: newEmail,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Update email error:', error);
    throw error;
  }
};

/**
 * Update user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
export const updateUserPassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Reauthenticate user before changing password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update password
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error('Update password error:', error);
    throw error;
  }
};

/**
 * Create user document in Firestore
 * @param {Object} user - Firebase user object
 * @param {Object} additionalData - Additional user data
 * @returns {Promise<void>}
 */
export const createUserDocument = async (user, additionalData = {}) => {
  if (!user) return;
  
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    const { displayName, email, photoURL } = user;
    const createdAt = serverTimestamp();
    
    try {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: displayName || additionalData.displayName || '',
        email,
        photoURL: photoURL || '',
        createdAt,
        lastLoginAt: createdAt,
        plan: 'free',
        credits: 5, // Free tier daily credits
        ...additionalData
      });
    } catch (error) {
      console.error('Error creating user document:', error);
    }
  }
};

/**
 * Get current user data from Firestore
 * @returns {Promise<Object|null>} - User data or null if not authenticated
 */
export const getCurrentUserData = async () => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      return null;
    }
    
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    
    return null;
  } catch (error) {
    console.error('Get user data error:', error);
    throw error;
  }
};

// Export all functions
const AuthService = {
  registerWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signInWithGithub,
  signOutUser,
  resetPassword,
  updateUserProfile,
  updateUserEmail,
  updateUserPassword,
  getCurrentUserData
};

export default AuthService;
