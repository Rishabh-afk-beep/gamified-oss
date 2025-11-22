import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 30000, // 30 seconds timeout for AI requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('access_token');
      // Don't redirect automatically in development
      if (window.location.pathname !== '/login') {
        console.warn('⚠️ Authentication required');
      }
    }
    
    return Promise.reject(error);
  }
);

// API Service methods
export const apiService = {
  // Firebase authentication
  firebaseLogin: async (token) => {
    try {
      const response = await api.post('/auth/firebase/login', { token });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Firebase login failed');
    }
  },

  // Analytics
  getAnalytics: async () => {
    try {
      const response = await api.get('/analytics/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch analytics');
    }
  },

  // Analytics progress data
  getProgressData: async () => {
    try {
      const response = await api.get('/analytics/me/progress');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch progress data');
    }
  },

  // Leaderboard
  getLeaderboard: async () => {
    try {
      const response = await api.get('/analytics/leaderboard/monthly');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch leaderboard');
    }
  },

  // Quests
  getQuests: async () => {
    try {
      const response = await api.get('/quests');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch quests');
    }
  },

  completeQuest: async (questId, userId = 'demo_user') => {
    try {
      const response = await api.post('/quests/complete', { 
        quest_id: questId, 
        user_id: userId 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to complete quest');
    }
  },

  startQuest: async (questId, userId = 'demo_user') => {
    try {
      const response = await api.post('/quests/start', { 
        quest_id: questId, 
        user_id: userId 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to start quest');
    }
  },

  // User management
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch user data');
    }
  },

  // Add other API methods as needed
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  delete: (url, config) => api.delete(url, config),
};

export default api;
