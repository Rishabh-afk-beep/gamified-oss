import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { auth } from '../config/firebase';

class FirebaseAuthService {
  constructor() {
    this.auth = auth;
  }

  // Register new user with email and password
  async register(email, password, displayName) {
    try {
      console.log('🔥 Firebase: Creating user with email:', email);
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Update user profile with display name
      if (displayName) {
        await updateProfile(user, {
          displayName: displayName
        });
      }

      console.log('✅ Firebase: User created successfully:', user);
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || displayName,
        token: await user.getIdToken()
      };
    } catch (error) {
      console.error('❌ Firebase Registration Error:', error);
      throw this.handleFirebaseError(error);
    }
  }

  // Sign in existing user
  async login(email, password) {
    try {
      console.log('🔥 Firebase: Signing in user:', email);
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      console.log('✅ Firebase: Login successful:', user);
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        token: await user.getIdToken()
      };
    } catch (error) {
      console.error('❌ Firebase Login Error:', error);
      throw this.handleFirebaseError(error);
    }
  }

  // Sign out user
  async logout() {
    try {
      console.log('🔥 Firebase: Signing out user');
      await signOut(this.auth);
      console.log('✅ Firebase: Logout successful');
    } catch (error) {
      console.error('❌ Firebase Logout Error:', error);
      throw this.handleFirebaseError(error);
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return onAuthStateChanged(this.auth, callback);
  }

  // Get current user
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Get current user token
  async getCurrentUserToken() {
    const user = this.getCurrentUser();
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  // Handle Firebase errors
  handleFirebaseError(error) {
    const errorMessages = {
      'auth/user-not-found': 'No user found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'An account already exists with this email address.',
      'auth/weak-password': 'Password should be at least 6 characters long.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
    };

    return new Error(errorMessages[error.code] || error.message);
  }
}

export const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;