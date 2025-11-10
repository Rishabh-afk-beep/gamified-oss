import api from './api';

export const workflowService = {
  // Initialize workflow
  async initWorkflow(userId = 'demo_user') {
    try {
      const response = await api.post('/workflow/init', { user_id: userId });
      return response.data;
    } catch (error) {
      console.error('Error initializing workflow:', error);
      throw error;
    }
  },

  // Get current workflow state
  async getWorkflowState(userId = 'demo_user') {
    try {
      const response = await api.get(`/workflow/${userId}/state`);
      return response.data;
    } catch (error) {
      console.error('Error getting workflow state:', error);
      throw error;
    }
  },

  // Update workflow state
  async updateWorkflowState(newState, userId = 'demo_user', metadata = {}) {
    try {
      const response = await api.post('/workflow/update-state', {
        new_state: newState,
        user_id: userId,
        metadata
      });
      return response.data;
    } catch (error) {
      console.error('Error updating workflow state:', error);
      throw error;
    }
  },

  // Ask for AI help
  async askAIHelp(taskId, question, userId = 'demo_user') {
    try {
      const response = await api.post('/workflow/ask-ai-help', {
        task_id: taskId,
        question,
        user_id: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error asking for AI help:', error);
      throw error;
    }
  },

  // Submit code for review
  async submitCodeForReview(taskId, code, userId = 'demo_user') {
    try {
      const response = await api.post('/workflow/submit-for-review', {
        task_id: taskId,
        code,
        user_id: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting code:', error);
      throw error;
    }
  },

  // Get workflow analytics
  async getWorkflowAnalytics(userId = 'demo_user') {
    try {
      const response = await api.get(`/workflow/${userId}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  },

  // Get workflow progress
  async getWorkflowProgress(userId = 'demo_user') {
    try {
      const response = await api.get(`/workflow/${userId}/progress`);
      return response.data;
    } catch (error) {
      console.error('Error getting progress:', error);
      throw error;
    }
  }
};
