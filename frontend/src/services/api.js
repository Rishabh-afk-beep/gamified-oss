import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Auth
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Quests
  getQuests: (limit = 50, skip = 0) => api.get(`/quests?limit=${limit}&skip=${skip}`),
  getQuestById: (questId) => api.get(`/quests/${questId}`),
  startQuest: (questId, userId) => api.post(`/quests/${questId}/start`, { user_id: userId }),
  
  // Leaderboard
  getLeaderboard: (type = 'all_time', limit = 100) => 
    api.get(`/leaderboard?type=${type}&limit=${limit}`),
  getUserRank: (userId, type = 'all_time') => 
    api.get(`/leaderboard/user/${userId}?type=${type}`),
  
  // Badges
  getAllBadges: () => api.get('/badges'),
  getBadgeById: (badgeId) => api.get(`/badges/${badgeId}`),
  
  // Users
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (userData) => api.put('/users/me', userData),
  getUserBadges: () => api.get('/users/me/badges'),
  getUserAchievements: () => api.get('/users/me/achievements'),
  
  // Analytics
  getAnalytics: () => api.get('/analytics/me'),
  getProgress: () => api.get('/analytics/me/progress'),
  
  // AI
  chatWithAI: (message, context) => api.post('/ai/chat', { message, context }),
  reviewCode: (code, language) => api.post('/ai/code-review', { code, language }),
};

export default api;
