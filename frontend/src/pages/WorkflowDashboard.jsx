import React, { useState, useEffect } from 'react';
import { workflowService } from '../services/workflowService';
import {
  RocketLaunchIcon,
  MapIcon,
  CodeBracketIcon,
  ClipboardDocumentListIcon,
  StarIcon,
  TrophyIcon,
  QuestionMarkCircleIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  ChartBarIcon,
  FireIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  LightBulbIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

export default function WorkflowDashboard() {
  const [workflowState, setWorkflowState] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [codeReview, setCodeReview] = useState('');
  const [showAIHelp, setShowAIHelp] = useState(false);

  const workflowSteps = [
    { 
      state: 'onboarding', 
      name: 'Getting Started', 
      icon: RocketLaunchIcon,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
      description: 'Welcome to your coding journey'
    },
    { 
      state: 'quest_selection', 
      name: 'Choose Quest', 
      icon: MapIcon,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      description: 'Select your learning path'
    },
    { 
      state: 'task_execution', 
      name: 'Write Code', 
      icon: CodeBracketIcon,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      description: 'Build and create'
    },
    { 
      state: 'code_review', 
      name: 'Get Review', 
      icon: ClipboardDocumentListIcon,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
      description: 'Improve and learn'
    },
    { 
      state: 'making_contribution', 
      name: 'Contribute', 
      icon: StarIcon,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
      description: 'Share your work'
    },
    { 
      state: 'completed', 
      name: 'Completed', 
      icon: TrophyIcon,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      description: 'Mission accomplished'
    }
  ];

  useEffect(() => {
    const fetchWorkflowData = async () => {
      try {
        const [workflowResponse, analyticsResponse] = await Promise.all([
          workflowService.getWorkflowState(),
          workflowService.getAnalytics()
        ]);
        
        setWorkflowState(workflowResponse.data);
        setAnalytics(analyticsResponse.data);
      } catch (error) {
        console.error('Error fetching workflow data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflowData();
  }, []);

  const handleAskHelp = async () => {
    if (!question.trim()) return;
    
    try {
      const response = await workflowService.askForHelp(question);
      
      if (response.success) {
        setAiResponse(response.ai_response);
        setQuestion('');
      }
    } catch (error) {
      console.error('Error getting AI help:', error);
    }
  };

  const handleSubmitCode = async () => {
    if (!code.trim()) return;
    
    try {
      const response = await workflowService.submitCodeForReview('current_task', code);
      
      if (response.success) {
        setCodeReview(response.feedback);
        setCode('');
      }
    } catch (error) {
      console.error('Error submitting code:', error);
    }
  };

  const getStepIndex = (state) => {
    const index = workflowSteps.findIndex(step => step.state === state);
    return index >= 0 ? index : 0;
  };

  const getStateDescription = (state) => {
    const descriptions = {
      'onboarding': 'Welcome! Complete your profile and choose your first quest.',
      'quest_selection': 'Select a quest that matches your learning goals.',
      'task_execution': 'Write code to solve the task. Need help? Ask AI!',
      'code_review': 'Submit your code for AI review and feedback.',
      'making_contribution': 'Make your contribution to open source projects!',
      'completed': 'Congratulations! You have completed the workflow.'
    };
    return descriptions[state] || 'Continue your learning journey.';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-xl font-semibold text-gray-700 animate-pulse">Loading your workflow...</p>
        </div>
      </div>
    );
  }

  const currentStep = getStepIndex(workflowState?.state);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              🚀 Your Learning Journey
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Master Git, GitHub, and Open Source Contribution through an interactive workflow
            </p>
            <div className="mt-8 flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <FireIcon className="w-5 h-5 text-orange-300" />
                <span className="text-sm font-medium">Level {workflowState?.user?.level || 1}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <SparklesIcon className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium">{workflowState?.user?.total_xp || 0} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Workflow Progress Steps */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Progress Timeline
            </h2>
            <div className="text-sm font-medium text-gray-500">
              Step {currentStep + 1} of {workflowSteps.length}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            {workflowSteps.map((step, idx) => {
              const IconComponent = step.icon;
              const isActive = idx === currentStep;
              const isCompleted = idx < currentStep;
              const isUpcoming = idx > currentStep;

              return (
                <div key={idx} className="relative">
                  <div className={`
                    group relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer
                    ${isActive ? `border-transparent bg-gradient-to-br ${step.color} text-white shadow-xl scale-105` : 
                      isCompleted ? 'border-green-200 bg-green-50 text-green-800' : 
                      'border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300 hover:bg-gray-100'}
                  `}>
                    <div className="text-center">
                      <div className={`
                        w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300
                        ${isActive ? 'bg-white/20 backdrop-blur-sm' : 
                          isCompleted ? 'bg-green-200' : 'bg-white'}
                      `}>
                        {isCompleted ? (
                          <CheckCircleIcon className="w-8 h-8 text-green-600" />
                        ) : (
                          <IconComponent className={`w-8 h-8 ${isActive ? 'text-white' : isUpcoming ? 'text-gray-400' : 'text-green-600'}`} />
                        )}
                      </div>
                      
                      <h3 className={`font-bold mb-2 ${isActive ? 'text-white' : ''}`}>
                        {step.name}
                      </h3>
                      
                      <p className={`text-sm ${isActive ? 'text-white/80' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                        {step.description}
                      </p>
                    </div>

                    {isActive && (
                      <div className="absolute -top-2 -right-2">
                        <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>

                  {idx < workflowSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                      <ArrowRightIcon className={`w-6 h-6 ${idx < currentStep ? 'text-green-500' : 'text-gray-300'}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Current State Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Current Phase: <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {workflowState?.state?.replace(/_/g, ' ').toUpperCase() || 'GETTING STARTED'}
              </span>
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {getStateDescription(workflowState?.state)}
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Code Writing Section */}
          {workflowState?.state === 'task_execution' && (
            <div className="xl:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <CodeBracketIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Code Editor</h3>
                  <p className="text-gray-600">Write your solution here</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="// Write your amazing code here...&#10;function solution() {&#10;  // Your logic&#10;}"
                  className="w-full h-64 p-6 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-mono text-sm bg-gray-50"
                  rows="15"
                />
                
                <div className="flex flex-wrap gap-4">
                  <button 
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    onClick={() => setShowAIHelp(!showAIHelp)}
                  >
                    <QuestionMarkCircleIcon className="w-5 h-5" />
                    <span>{showAIHelp ? 'Hide AI Help' : 'Need Help?'}</span>
                  </button>
                  
                  <button 
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    onClick={handleSubmitCode}
                    disabled={!code.trim()}
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                    <span>Submit Code</span>
                  </button>
                </div>

                {/* AI Help Section */}
                {showAIHelp && (
                  <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <CpuChipIcon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-800">AI Assistant</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask me anything about your code, algorithms, or programming concepts..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        rows="3"
                      />
                      
                      <button 
                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
                        onClick={handleAskHelp}
                        disabled={!question.trim()}
                      >
                        <LightBulbIcon className="w-4 h-4" />
                        <span>Ask AI</span>
                      </button>

                      {aiResponse && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                          <h5 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                            <SparklesIcon className="w-4 h-4 text-blue-500" />
                            <span>AI Response:</span>
                          </h5>
                          <p className="text-gray-700 leading-relaxed">{aiResponse}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analytics Sidebar */}
          <div className={`${workflowState?.state === 'task_execution' ? 'xl:col-span-1' : 'xl:col-span-3'} space-y-6`}>
            {/* Progress Stats */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Your Progress</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Total XP', value: workflowState?.user?.total_xp || 0, icon: SparklesIcon, color: 'from-yellow-500 to-orange-500' },
                  { label: 'Current Level', value: workflowState?.user?.level || 1, icon: TrophyIcon, color: 'from-purple-500 to-pink-500' },
                  { label: 'Submissions', value: analytics?.analytics?.total_submissions || 0, icon: PaperAirplaneIcon, color: 'from-blue-500 to-indigo-500' },
                  { label: 'AI Help', value: analytics?.analytics?.ai_help_requests || 0, icon: LightBulbIcon, color: 'from-green-500 to-emerald-500' },
                  { label: 'Tasks Done', value: analytics?.analytics?.tasks_completed || 0, icon: CheckCircleIcon, color: 'from-teal-500 to-cyan-500' },
                  { label: 'Contributions', value: analytics?.analytics?.contributions || 0, icon: StarIcon, color: 'from-orange-500 to-red-500' }
                ].map((stat, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                        <stat.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Review Results */}
            {codeReview && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <ClipboardDocumentListIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Code Review</h3>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100">
                  <p className="text-gray-700 leading-relaxed">{codeReview}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}