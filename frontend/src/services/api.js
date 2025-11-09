import axios from 'axios';

// Get API URL from environment or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

console.log('🔗 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔐 Token added to request');
  }
  return config;
});

// Interceptor to handle responses
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Health
  health: () => {
    console.log('🏥 Checking health...');
    return api.get('/health');
  },

  // Auth endpoints
  register: (userData) => {
    console.log('📝 Registering user:', userData.username);
    return api.post('/auth/register', userData);
  },
  
  login: (credentials) => {
    console.log('🔓 Logging in...');
    return api.post('/auth/login', credentials);
  },

  // Quests
  getQuests: (limit = 50, skip = 0) => {
    console.log('📚 Fetching quests...');
    return api.get(`/quests?limit=${limit}&skip=${skip}`);
  },
  
  getQuestById: (questId) => {
    console.log('📖 Fetching quest:', questId);
    return api.get(`/quests/${questId}`);
  },

  // Leaderboard
  getLeaderboard: (type = 'all_time', limit = 100) => {
    console.log('🏆 Fetching leaderboard...');
    return api.get(`/leaderboard?type=${type}&limit=${limit}`);
  },

  // Badges
  getBadges: () => {
    console.log('🎖️ Fetching badges...');
    return api.get('/badges');
  },

  // Users
  getCurrentUser: () => {
    console.log('👤 Fetching current user...');
    return api.get('/users/me');
  },

  // Analytics
  getAnalytics: () => {
    console.log('📊 Fetching analytics...');
    return api.get('/analytics/me');
  },
};

export default api;
