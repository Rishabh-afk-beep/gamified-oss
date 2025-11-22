/**
 * Firebase Configuration and Initialization
 * Handles Firebase app setup and authentication service
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gamified-oss.firebaseapp.com", 
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gamified-oss",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gamified-oss.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "189137801621",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:189137801621:web:d73bba21c289e8522ca69c",
  measurementId: "G-KEH7BKQCYS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Export the app for other Firebase services if needed
export default app;

console.log('🔥 Firebase initialized successfully for project:', firebaseConfig.projectId);