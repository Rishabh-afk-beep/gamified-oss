import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiService } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (token) {
        // Try to fetch user from real backend
        const response = await apiService.getCurrentUser();
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log('Not authenticated');
    } finally {
      setLoading(false);
    }
  };

  const testLogin = () => {
    // Mock login for testing
    const mockUser = {
      id: '1',
      username: 'demo_user',
      email: 'demo@example.com',
      level: 3,
      total_xp: 1250,
      current_streak: 5,
      longest_streak: 12,
      badges: [],
    };
    localStorage.setItem('access_token', 'test_token_12345');
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      localStorage.setItem('access_token', response.data.access_token);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout, testLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
