import React, { useState, useEffect } from 'react';
import { workflowService } from '../services/workflowService';
import './WorkflowDashboard.css';

export default function WorkflowDashboard() {
  const [workflowState, setWorkflowState] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [showAIHelp, setShowAIHelp] = useState(false);
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [code, setCode] = useState('');
  const [codeReview, setCodeReview] = useState(null);

  const workflowSteps = [
    { name: 'Onboarding', icon: '👋', state: 'onboarding' },
    { name: 'Quest Selection', icon: '🎯', state: 'quest_selection' },
    { name: 'Write Code', icon: '💻', state: 'writing_code' },
    { name: 'Need Help?', icon: '❓', state: 'asked_for_help' },
    { name: 'Code Review', icon: '👀', state: 'code_review' },
    { name: 'Contribute', icon: '🚀', state: 'making_contribution' },
    { name: 'Complete', icon: '✅', state: 'completed' }
  ];

  useEffect(() => {
    fetchWorkflowData();
  }, []);

  const fetchWorkflowData = async () => {
    try {
      setLoading(true);
      const stateData = await workflowService.getWorkflowState();
      const analyticsData = await workflowService.getWorkflowAnalytics();
      
      setWorkflowState(stateData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching workflow data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAskHelp = async () => {
    try {
      const response = await workflowService.askAIHelp(
        'current_task',
        question
      );
      
      if (response.success) {
        setAiResponse(response.ai_response);
        setQuestion('');
        alert('✅ AI Help Received!');
      }
    } catch (error) {
      alert('Error getting AI help');
    }
  };

  const handleSubmitCode = async () => {
    try {
      const response = await workflowService.submitCodeForReview(
        'current_task',
        code
      );
      
      if (response.success) {
        setCodeReview(response.feedback);
        setCode('');
        alert('✅ Code Submitted for Review!');
      }
    } catch (error) {
      alert('Error submitting code');
    }
  };

  const getStepIndex = (state) => {
    const index = workflowSteps.findIndex(step => step.state === state);
    return index >= 0 ? index : 0;
  };

  if (loading) {
    return <div className="loading">Loading workflow...</div>;
  }

  const currentStep = getStepIndex(workflowState?.state);

  return (
    <div className="workflow-dashboard">
      {/* Header */}
      <div className="workflow-header">
        <h1>🎯 Your Learning Journey</h1>
        <p>Follow the workflow to master Git, GitHub, and Open Source Contribution</p>
      </div>

      {/* Workflow Progress */}
      <div className="workflow-progress">
        <h2>Progress</h2>
        <div className="steps-container">
          {workflowSteps.map((step, idx) => (
            <div key={idx} className="step-wrapper">
              <div className={`step ${idx <= currentStep ? 'active' : ''}`}>
                <span className="step-icon">{step.icon}</span>
              </div>
              <p className="step-label">{step.name}</p>
              {idx < workflowSteps.length - 1 && (
                <div className={`connector ${idx < currentStep ? 'filled' : ''}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="workflow-content">
        {/* Current State Info */}
        <div className="state-card">
          <h3>Current Phase: {workflowState?.state?.replace(/_/g, ' ').toUpperCase()}</h3>
          <p className="state-description">
            {getStateDescription(workflowState?.state)}
          </p>
        </div>

        {/* Code Writing Area */}
        {workflowState?.state === 'task_execution' && (
          <div className="code-section">
            <h3>💻 Write Your Code</h3>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write your solution here..."
              className="code-input"
              rows="10"
            />
            <div className="code-buttons">
              <button 
                className="btn-help"
                onClick={() => setShowAIHelp(!showAIHelp)}
              >
                ❓ Need Help?
              </button>
              <button 
                className="btn-submit"
                onClick={handleSubmitCode}
                disabled={!code.trim()}
              >
                📤 Submit Code
              </button>
            </div>

            {/* AI Help Section */}
            {showAIHelp && (
              <div className="ai-help-section">
                <h4>🤖 Ask AI for Help</h4>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask your question here..."
                  className="help-input"
                  rows="3"
                />
                <button 
                  className="btn-send"
                  onClick={handleAskHelp}
                >
                  Send Question
                </button>

                {aiResponse && (
                  <div className="ai-response">
                    <h5>AI Response:</h5>
                    <p>{aiResponse}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Code Review Results */}
        {codeReview && (
          <div className="review-section">
            <h3>📋 Code Review Feedback</h3>
            <div className="review-content">
              <p>{codeReview}</p>
            </div>
          </div>
        )}

        {/* Analytics */}
        <div className="analytics-section">
          <h3>📊 Your Progress</h3>
          <div className="analytics-grid">
            <div className="analytics-card">
              <span className="label">Total XP</span>
              <span className="value">{workflowState?.user?.total_xp || 0}</span>
            </div>
            <div className="analytics-card">
              <span className="label">Current Level</span>
              <span className="value">{workflowState?.user?.level || 1}</span>
            </div>
            <div className="analytics-card">
              <span className="label">Submissions</span>
              <span className="value">{analytics?.analytics?.total_submissions || 0}</span>
            </div>
            <div className="analytics-card">
              <span className="label">AI Help Requests</span>
              <span className="value">{analytics?.analytics?.ai_help_requests || 0}</span>
            </div>
            <div className="analytics-card">
              <span className="label">Tasks Completed</span>
              <span className="value">{analytics?.analytics?.tasks_completed || 0}</span>
            </div>
            <div className="analytics-card">
              <span className="label">Contributions</span>
              <span className="value">{analytics?.analytics?.contributions || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get state description
function getStateDescription(state) {
  const descriptions = {
    'onboarding': 'Welcome! Complete your profile and choose your first quest.',
    'quest_selection': 'Select a quest that matches your learning goals.',
    'writing_code': 'Write code to solve the task. Need help? Ask AI!',
    'asked_for_help': 'AI guidance provided. Now complete your solution.',
    'code_review': 'Submit your code for AI review and feedback.',
    'making_contribution': 'Make your contribution to open source projects!',
    'completed': 'Congratulations! You have completed the workflow.'
  };
  return descriptions[state] || 'Continue your learning journey.';
}
