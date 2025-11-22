/**
 * Debug Authentication Component
 * Shows current auth state, token info, and user data
 */

import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const AuthDebug = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  const checkAuthState = () => {
    console.group('🔍 Authentication Debug');
    
    // Check localStorage token
    const token = localStorage.getItem('access_token');
    console.log('📦 Local Storage Token:', token ? 'Present' : 'Missing');
    if (token) {
      console.log('🔑 Token (first 50 chars):', token.substring(0, 50) + '...');
    }
    
    // Check AuthContext state
    console.log('🏠 AuthContext isAuthenticated:', isAuthenticated);
    console.log('👤 AuthContext user:', user);
    
    // Decode token payload if present
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('🔓 Token Payload:', {
          uid: payload.uid,
          email: payload.email,
          email_verified: payload.email_verified,
          exp: new Date(payload.exp * 1000),
          iat: new Date(payload.iat * 1000)
        });
      } catch (e) {
        console.log('❌ Failed to decode token:', e.message);
      }
    }
    
    console.groupEnd();
  };

  const testApiCall = async () => {
    try {
      console.log('🚀 Testing API call to /auth/me...');
      const response = await fetch('/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      const data = await response.json();
      console.log('📡 API Response:', response.status, data);
      
      if (response.ok) {
        console.log('✅ API call successful - user is authenticated');
      } else {
        console.log('❌ API call failed - authentication issue');
      }
    } catch (error) {
      console.error('💥 API call error:', error);
    }
  };

  if (!isAuthenticated && !user) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg">
        <h3 className="font-semibold mb-2">🔍 Auth Debug</h3>
        <p className="text-sm text-gray-300 mb-2">Not authenticated</p>
        <button 
          onClick={checkAuthState}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          Check Auth State
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-green-800 text-white p-4 rounded-lg shadow-lg max-w-sm">
      <h3 className="font-semibold mb-2">✅ Auth Debug</h3>
      <div className="text-sm space-y-1 mb-3">
        <p><span className="text-green-300">Status:</span> Authenticated</p>
        <p><span className="text-green-300">Email:</span> {user?.email || 'N/A'}</p>
        <p><span className="text-green-300">Level:</span> {user?.level || 'N/A'}</p>
        <p><span className="text-green-300">XP:</span> {user?.total_xp || user?.xp || 'N/A'}</p>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={checkAuthState}
          className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
        >
          Console Log
        </button>
        <button 
          onClick={testApiCall}
          className="bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700"
        >
          Test API
        </button>
      </div>
    </div>
  );
};

export default AuthDebug;