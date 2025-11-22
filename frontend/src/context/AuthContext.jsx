import React, { createContext, useState, useEffect, useContext } from 'react';
import { firebaseAuthService } from '../services/firebaseAuthService';
import { apiService } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = firebaseAuthService.onAuthStateChange(async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        try {
          // Get Firebase token
          const token = await firebaseUser.getIdToken();
          
          // Store token for API requests
          localStorage.setItem('access_token', token);
          
          // Call backend to register/login user and get full user data
          try {
            console.log('🔄 Calling backend login with Firebase token...');
            const response = await apiService.firebaseLogin(token);
            const backendUser = response.data.user;
            
            // Use backend user data (includes gamification data)
            setUser(backendUser);
            setIsAuthenticated(true);
            console.log('✅ Backend: User authenticated with full data', backendUser);
            
          } catch (backendError) {
            console.warn('⚠️ Backend call failed, using Firebase data only:', backendError);
            
            // Fallback to Firebase user data if backend fails
            const userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              emailVerified: firebaseUser.emailVerified,
              photoURL: firebaseUser.photoURL,
              // Default gamification data (backend should handle this)
              level: 1,
              total_xp: 0,
              current_streak: 0,
              longest_streak: 0,
              badges: [],
            };
            
            setUser(userData);
            setIsAuthenticated(true);
            console.log('✅ Firebase: User authenticated with fallback data', userData);
          }
        } catch (error) {
          console.error('❌ Error setting up authenticated user:', error);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // User is signed out
        localStorage.removeItem('access_token');
        setUser(null);
        setIsAuthenticated(false);
        console.log('� Firebase: User signed out');
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Register new user
  const register = async (email, password, displayName) => {
    try {
      console.log('🔥 Starting registration process...');
      const userData = await firebaseAuthService.register(email, password, displayName);
      
      // Note: The onAuthStateChange listener will handle setting user state
      // when Firebase auth state changes
      
      return userData;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  };

  // Login existing user
  const login = async (email, password) => {
    try {
      console.log('🔥 Starting login process...');
      const userData = await firebaseAuthService.login(email, password);
      
      // Note: The onAuthStateChange listener will handle setting user state
      // when Firebase auth state changes
      
      return userData;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await firebaseAuthService.logout();
      // Note: The onAuthStateChange listener will handle clearing user state
    } catch (error) {
      console.error('❌ Logout failed:', error);
      throw error;
    }
  };

  // Keep the testLogin for demo purposes (will be removed later)
  const testLogin = () => {
    console.log('🧪 Test login is deprecated. Please use Firebase authentication.');
    // You can remove this or redirect to show auth modal
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    testLogin, // Keep for now, will remove later
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
