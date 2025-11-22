import api from './api';

export const aiService = {
  sendMessage: async (message, context = null) => {
    try {
      const response = await api.post('/ai/chat', {
        message,
        context: context || '',
        user_id: 'demo_user' // You can make this dynamic later
      });
      
      // Check if response and data exist
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      // Check for successful response
      if (response.data.success) {
        return {
          success: true,
          response: response.data.response,
          message: response.data.response
        };
      } else {
        throw new Error(response.data.error || 'AI service returned an error');
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      
      // Handle different error types
      if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else if (error.response?.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      } else if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to send message to AI');
      }
    }
  },

  reviewCode: async (code, language, questContext = null) => {
    try {
      const response = await api.post('/ai/review-code', {
        code,
        language,
        quest_context: questContext
      });
      
      if (!response || !response.data) {
        throw new Error('Invalid response from code review service');
      }
      
      return response.data;
    } catch (error) {
      console.error('Code Review Error:', error);
      throw new Error(error.response?.data?.detail || 'Failed to review code');
    }
  },

  getQuestHint: async (questId, questContext, userAttempt = null) => {
    try {
      const response = await api.post('/ai/quest-hint', {
        quest_id: questId,
        quest_context: questContext,
        user_attempt: userAttempt
      });
      
      if (!response || !response.data) {
        throw new Error('Invalid response from hint service');
      }
      
      return response.data;
    } catch (error) {
      console.error('Quest Hint Error:', error);
      throw new Error(error.response?.data?.detail || 'Failed to get quest hint');
    }
  },

  getHint: async (problemTitle, problemDescription, difficulty = 'beginner') => {
    try {
      const response = await api.post('/ai/get-hint', {
        problem_title: problemTitle,
        problem_description: problemDescription,
        difficulty
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get hint');
    }
  },

  explainConcept: async (concept, level = 'beginner') => {
    try {
      const response = await api.post('/ai/learn-concept', {
        concept,
        level
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to explain concept');
    }
  },

  explainCode: async (code, language = 'javascript') => {
    try {
      const response = await api.post('/ai/explain-code', {
        code,
        language
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to explain code');
    }
  }
};
