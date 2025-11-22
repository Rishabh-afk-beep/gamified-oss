import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  PlayCircleIcon,
  BookOpenIcon,
  CheckCircleIcon,
  LockClosedIcon,
  ClockIcon,
  StarIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  CommandLineIcon,
  GlobeAltIcon,
  UserGroupIcon,
  TrophyIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  FireIcon,
  SparklesIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';

export default function ModernTutorials() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [completedModules, setCompletedModules] = useState(new Set());
  const [selectedModule, setSelectedModule] = useState(null);
  const [showModuleDetail, setShowModuleDetail] = useState(false);
  const [userProgress, setUserProgress] = useState({});

  // Comprehensive Open Source Learning Modules
  const learningModules = [
    {
      id: 1,
      title: "Git & Version Control Fundamentals",
      description: "Master the foundation of all software development - version control with Git",
      difficulty: "Beginner",
      estimatedTime: "2-3 hours",
      xpReward: 150,
      color: "from-emerald-500 to-teal-600",
      icon: CommandLineIcon,
      prerequisite: null,
      modules: [
        "Understanding Version Control",
        "Git Installation & Setup", 
        "Basic Git Commands (init, add, commit)",
        "Git Branching & Merging",
        "Working with Remote Repositories"
      ],
      learningOutcomes: [
        "Understand what version control is and why it's essential",
        "Install and configure Git on your system",
        "Create repositories and make commits",
        "Work with branches for feature development",
        "Push and pull changes from remote repositories"
      ],
      practicalProjects: [
        "Create your first Git repository",
        "Build a simple project with multiple commits",
        "Practice branching and merging strategies"
      ]
    },
    {
      id: 2, 
      title: "GitHub Platform Mastery",
      description: "Navigate GitHub like a pro - from repositories to collaboration features",
      difficulty: "Beginner",
      estimatedTime: "1-2 hours",
      xpReward: 120,
      color: "from-blue-500 to-indigo-600",
      icon: GlobeAltIcon,
      prerequisite: 1,
      modules: [
        "GitHub Account Setup & Profile",
        "Creating & Managing Repositories",
        "Understanding Issues & Discussions",
        "GitHub Desktop vs Command Line",
        "Repository Settings & Permissions"
      ],
      learningOutcomes: [
        "Set up a professional GitHub profile",
        "Create and organize repositories effectively",
        "Use GitHub Issues for project management",
        "Understand repository visibility and permissions",
        "Navigate GitHub's interface confidently"
      ],
      practicalProjects: [
        "Create a stunning GitHub profile",
        "Set up your first public repository",
        "Practice using GitHub Issues"
      ]
    },
    {
      id: 3,
      title: "Markdown Documentation",
      description: "Write beautiful documentation that developers love to read",
      difficulty: "Beginner", 
      estimatedTime: "1 hour",
      xpReward: 100,
      color: "from-purple-500 to-pink-600",
      icon: BookOpenIcon,
      prerequisite: 2,
      modules: [
        "Markdown Syntax Essentials",
        "Advanced Markdown Features",
        "README.md Best Practices",
        "Documentation Structure",
        "Adding Images & Links"
      ],
      learningOutcomes: [
        "Write clean, readable Markdown",
        "Create professional README files",
        "Structure documentation effectively",
        "Add visual elements to docs",
        "Follow documentation best practices"
      ],
      practicalProjects: [
        "Write a comprehensive README for a project",
        "Create project documentation",
        "Build a personal portfolio page in Markdown"
      ]
    },
    {
      id: 4,
      title: "Open Source Project Discovery",
      description: "Find the perfect open source projects to contribute to",
      difficulty: "Beginner",
      estimatedTime: "1-2 hours", 
      xpReward: 110,
      color: "from-orange-500 to-red-500",
      icon: RocketLaunchIcon,
      prerequisite: 3,
      modules: [
        "What Makes a Good First Project",
        "Using GitHub's Search & Filters",
        "Understanding Project Labels",
        "Reading Project Documentation",
        "Evaluating Project Health"
      ],
      learningOutcomes: [
        "Identify beginner-friendly projects",
        "Use GitHub search effectively",
        "Read and understand project requirements",
        "Assess project activity and community",
        "Find projects matching your interests"
      ],
      practicalProjects: [
        "Find 5 beginner-friendly projects in your language",
        "Analyze project documentation quality",
        "Create a list of projects to contribute to"
      ]
    },
    {
      id: 5,
      title: "Forking & Cloning Repositories", 
      description: "Master the first step of contributing - getting the code locally",
      difficulty: "Beginner",
      estimatedTime: "45 minutes",
      xpReward: 90,
      color: "from-teal-500 to-cyan-600",
      icon: CodeBracketIcon,
      prerequisite: 4,
      modules: [
        "Understanding Forking vs Cloning",
        "Creating Your Fork",
        "Cloning to Local Machine",
        "Setting Up Upstream Remote",
        "Keeping Your Fork Updated"
      ],
      learningOutcomes: [
        "Understand fork vs clone concepts",
        "Create your own fork of a project",
        "Clone repositories to work locally",
        "Set up proper remote tracking",
        "Sync with upstream changes"
      ],
      practicalProjects: [
        "Fork a popular open source project",
        "Clone it and set up your development environment", 
        "Practice updating your fork"
      ]
    },
    {
      id: 6,
      title: "Making Your First Contribution",
      description: "Submit your first pull request and become an open source contributor",
      difficulty: "Intermediate",
      estimatedTime: "2-3 hours",
      xpReward: 200,
      color: "from-indigo-500 to-purple-600", 
      icon: UserGroupIcon,
      prerequisite: 5,
      modules: [
        "Finding Good First Issues",
        "Creating Feature Branches",
        "Making Quality Commits",
        "Testing Your Changes",
        "Creating Pull Requests"
      ],
      learningOutcomes: [
        "Find appropriate issues to work on",
        "Follow proper branching workflow",
        "Write meaningful commit messages",
        "Test changes before submitting",
        "Create clear, detailed pull requests"
      ],
      practicalProjects: [
        "Find and fix a 'good first issue'",
        "Submit your first pull request",
        "Respond to code review feedback"
      ]
    },
    {
      id: 7,
      title: "Code Review & Collaboration",
      description: "Learn to give and receive feedback like a professional developer",
      difficulty: "Intermediate", 
      estimatedTime: "1-2 hours",
      xpReward: 180,
      color: "from-yellow-500 to-orange-500",
      icon: TrophyIcon,
      prerequisite: 6,
      modules: [
        "Understanding Code Review Process",
        "Responding to Feedback Professionally",
        "Making Requested Changes",
        "Reviewing Others' Code",
        "Best Practices for Collaboration"
      ],
      learningOutcomes: [
        "Handle code review feedback positively",
        "Make revisions based on suggestions",
        "Provide constructive feedback to others",
        "Communicate effectively with maintainers",
        "Build relationships in the community"
      ],
      practicalProjects: [
        "Respond to feedback on your PR",
        "Review someone else's pull request",
        "Practice collaborative communication"
      ]
    },
    {
      id: 8,
      title: "Advanced Git Workflows",
      description: "Master complex Git operations and advanced contribution patterns",
      difficulty: "Intermediate",
      estimatedTime: "2-3 hours",
      xpReward: 220,
      color: "from-red-500 to-pink-600",
      icon: FireIcon,
      prerequisite: 7,
      modules: [
        "Interactive Rebase & History Editing",
        "Resolving Merge Conflicts",
        "Cherry-picking & Advanced Merging",
        "Git Hooks & Automation",
        "Release Management"
      ],
      learningOutcomes: [
        "Clean up commit history with rebase",
        "Resolve complex merge conflicts",
        "Use advanced Git commands confidently",
        "Set up automated workflows",
        "Understand release processes"
      ],
      practicalProjects: [
        "Practice interactive rebase",
        "Resolve merge conflicts",
        "Set up Git hooks for automation"
      ]
    },
    {
      id: 9,
      title: "Contributing to Large Projects",
      description: "Navigate complex codebases and contribute to major open source projects",
      difficulty: "Advanced",
      estimatedTime: "3-4 hours",
      xpReward: 280,
      color: "from-violet-500 to-purple-600",
      icon: SparklesIcon,
      prerequisite: 8,
      modules: [
        "Understanding Large Codebase Architecture",
        "Following Contribution Guidelines",
        "Working with CI/CD Pipelines",
        "Managing Dependencies",
        "Security & Best Practices"
      ],
      learningOutcomes: [
        "Navigate large, complex codebases",
        "Follow strict contribution guidelines",
        "Work with continuous integration",
        "Handle dependency management",
        "Understand security considerations"
      ],
      practicalProjects: [
        "Contribute to a major open source project",
        "Set up and work with CI/CD",
        "Handle complex dependency updates"
      ]
    },
    {
      id: 10,
      title: "Building Your Open Source Reputation",
      description: "Establish yourself as a trusted contributor in the open source community",
      difficulty: "Advanced",
      estimatedTime: "2-3 hours",
      xpReward: 250,
      color: "from-emerald-500 to-blue-600", 
      icon: AcademicCapIcon,
      prerequisite: 9,
      modules: [
        "Creating Your Own Projects",
        "Maintaining Open Source Projects",
        "Community Building & Leadership",
        "Speaking & Writing About Open Source",
        "Career Development Through OSS"
      ],
      learningOutcomes: [
        "Launch and maintain your own projects",
        "Build and lead communities",
        "Share knowledge through content creation",
        "Leverage OSS for career growth",
        "Become a recognized community member"
      ],
      practicalProjects: [
        "Create and publish your own open source project",
        "Write technical blog posts",
        "Speak at meetups or conferences"
      ]
    }
  ];

  const isModuleUnlocked = (moduleId) => {
    if (moduleId === 1) return true; // First module is always unlocked
    const module = learningModules.find(m => m.id === moduleId);
    if (!module || !module.prerequisite) return true;
    return completedModules.has(module.prerequisite);
  };

  const getCompletionPercentage = () => {
    return Math.round((completedModules.size / learningModules.length) * 100);
  };

  const getTotalXP = () => {
    return learningModules
      .filter(module => completedModules.has(module.id))
      .reduce((total, module) => total + module.xpReward, 0);
  };

  const handleModuleComplete = (moduleId) => {
    setCompletedModules(prev => new Set([...prev, moduleId]));
    // Here you would typically call an API to save progress
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-yellow-100 text-yellow-800', 
      'Advanced': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              🚀 Open Source Mastery
            </h1>
            <p className="text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Complete learning path from Git basics to becoming a respected open source contributor
            </p>
            
            {/* Progress Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mt-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-center mb-3">
                  <TrophyIcon className="w-8 h-8 text-yellow-300" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{getCompletionPercentage()}%</h3>
                <p className="text-blue-200 text-sm">Completion Rate</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-center mb-3">
                  <StarSolid className="w-8 h-8 text-yellow-300" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{getTotalXP()}</h3>
                <p className="text-blue-200 text-sm">XP Earned</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-center mb-3">
                  <AcademicCapIcon className="w-8 h-8 text-yellow-300" />
                </div>
                <h3 className="text-3xl font-bold mb-1">{completedModules.size}/{learningModules.length}</h3>
                <p className="text-blue-200 text-sm">Modules Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Path */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Your Learning Journey</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master open source contribution through our carefully crafted 10-module curriculum. 
            Each module builds upon the previous ones to ensure solid understanding.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="space-y-8">
          {learningModules.map((module, index) => {
            const IconComponent = module.icon;
            const isCompleted = completedModules.has(module.id);
            const isUnlocked = isModuleUnlocked(module.id);
            const isNext = !isCompleted && isUnlocked;

            return (
              <div key={module.id} className="relative">
                {/* Connection Line */}
                {index < learningModules.length - 1 && (
                  <div className="absolute left-8 top-32 w-0.5 h-16 bg-gradient-to-b from-blue-300 to-purple-300"></div>
                )}

                <div 
                  className={`relative bg-white rounded-3xl shadow-xl border transition-all duration-300 hover:shadow-2xl ${
                    isCompleted ? 'border-green-200 ring-2 ring-green-100' :
                    isNext ? 'border-blue-200 ring-2 ring-blue-100 hover:scale-[1.02]' :
                    isUnlocked ? 'border-gray-200 hover:border-blue-200' :
                    'border-gray-200 opacity-60'
                  }`}
                >
                  <div className="p-8">
                    <div className="flex items-start gap-6">
                      {/* Module Icon & Number */}
                      <div className="flex-shrink-0">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${module.color} flex items-center justify-center relative`}>
                          {isCompleted ? (
                            <CheckCircleSolid className="w-8 h-8 text-white" />
                          ) : !isUnlocked ? (
                            <LockClosedIcon className="w-8 h-8 text-white" />
                          ) : (
                            <IconComponent className="w-8 h-8 text-white" />
                          )}
                          <div className="absolute -top-2 -left-2 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {module.id}
                          </div>
                        </div>
                      </div>

                      {/* Module Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{module.title}</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">{module.description}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(module.difficulty)}`}>
                              {module.difficulty}
                            </span>
                            {isNext && (
                              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                <FireIcon className="w-4 h-4" />
                                Next
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Module Stats */}
                        <div className="flex items-center gap-6 mb-6 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <ClockIcon className="w-4 h-4" />
                            <span>{module.estimatedTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <StarIcon className="w-4 h-4" />
                            <span>{module.xpReward} XP</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpenIcon className="w-4 h-4" />
                            <span>{module.modules.length} lessons</span>
                          </div>
                          {module.prerequisite && (
                            <div className="flex items-center gap-2">
                              <span>Requires Module {module.prerequisite}</span>
                            </div>
                          )}
                        </div>

                        {/* Module Preview */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <BookOpenIcon className="w-5 h-5" />
                              What You'll Learn
                            </h4>
                            <ul className="space-y-2">
                              {module.modules.slice(0, 3).map((lesson, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-gray-600">
                                  <ChevronRightIcon className="w-4 h-4 text-blue-500" />
                                  <span>{lesson}</span>
                                </li>
                              ))}
                              {module.modules.length > 3 && (
                                <li className="text-gray-500 text-sm">+{module.modules.length - 3} more lessons...</li>
                              )}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <RocketLaunchIcon className="w-5 h-5" />
                              Practical Projects
                            </h4>
                            <ul className="space-y-2">
                              {module.practicalProjects.map((project, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-gray-600">
                                  <ChevronRightIcon className="w-4 h-4 text-green-500" />
                                  <span>{project}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {isCompleted && (
                              <div className="flex items-center gap-2 text-green-600 font-semibold">
                                <CheckCircleSolid className="w-5 h-5" />
                                <span>Completed</span>
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={() => {
                              setSelectedModule(module);
                              setShowModuleDetail(true);
                            }}
                            disabled={!isUnlocked}
                            className={`
                              flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200
                              ${isCompleted 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : isUnlocked 
                                  ? `bg-gradient-to-r ${module.color} text-white hover:shadow-lg hover:scale-105` 
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }
                            `}
                          >
                            {isCompleted ? (
                              <>
                                <BookOpenIcon className="w-5 h-5" />
                                <span>Review Module</span>
                              </>
                            ) : (
                              <>
                                <PlayCircleIcon className="w-5 h-5" />
                                <span>{isUnlocked ? 'Start Module' : 'Locked'}</span>
                                <ArrowRightIcon className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Start Your Open Source Journey?</h3>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who have transformed their careers through open source contribution.
            </p>
            <button 
              onClick={() => {
                const firstIncompleteModule = learningModules.find(m => !completedModules.has(m.id) && isModuleUnlocked(m.id));
                if (firstIncompleteModule) {
                  setSelectedModule(firstIncompleteModule);
                  setShowModuleDetail(true);
                }
              }}
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors flex items-center gap-2 mx-auto"
            >
              <RocketLaunchIcon className="w-6 h-6" />
              {completedModules.size === 0 ? 'Begin Your Journey' : 'Continue Learning'}
            </button>
          </div>
        </div>
      </div>

      {/* Module Detail Modal */}
      {showModuleDetail && selectedModule && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className={`bg-gradient-to-r ${selectedModule.color} text-white p-8 rounded-t-3xl`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold">Module {selectedModule.id}: {selectedModule.title}</h2>
                <button 
                  onClick={() => setShowModuleDetail(false)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  ×
                </button>
              </div>
              <p className="text-xl text-white/90">{selectedModule.description}</p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpenIcon className="w-6 h-6 text-blue-500" />
                    Learning Outcomes
                  </h3>
                  <ul className="space-y-3">
                    {selectedModule.learningOutcomes.map((outcome, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <RocketLaunchIcon className="w-6 h-6 text-purple-500" />
                    Practical Projects
                  </h3>
                  <ul className="space-y-3">
                    {selectedModule.practicalProjects.map((project, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <StarIcon className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{project}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <AcademicCapIcon className="w-6 h-6 text-indigo-500" />
                  Module Lessons
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedModule.modules.map((lesson, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                        {idx + 1}
                      </div>
                      <span className="text-gray-700 font-medium">{lesson}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5" />
                    <span>{selectedModule.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarIcon className="w-5 h-5" />
                    <span>{selectedModule.xpReward} XP</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(selectedModule.difficulty)}`}>
                    {selectedModule.difficulty}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowModuleDetail(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      handleModuleComplete(selectedModule.id);
                      setShowModuleDetail(false);
                    }}
                    disabled={completedModules.has(selectedModule.id)}
                    className={`px-8 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 ${
                      completedModules.has(selectedModule.id)
                        ? 'bg-green-100 text-green-800'
                        : `bg-gradient-to-r ${selectedModule.color} text-white hover:shadow-lg`
                    }`}
                  >
                    {completedModules.has(selectedModule.id) ? (
                      <>
                        <CheckCircleSolid className="w-5 h-5" />
                        Completed
                      </>
                    ) : (
                      <>
                        <PlayCircleIcon className="w-5 h-5" />
                        Start Module
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}