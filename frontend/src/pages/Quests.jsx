import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  RocketLaunchIcon,
  StarIcon,
  TrophyIcon,
  FireIcon,
  CheckCircleIcon,
  ClockIcon,
  CodeBracketIcon,
  AcademicCapIcon,
  LightBulbIcon,
  SparklesIcon,
  PlayIcon,
  ArrowRightIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

const Quests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userProgress, setUserProgress] = useState({});
  const [completedQuests, setCompletedQuests] = useState(new Set());

  // Reset any demo completion state on component mount
  useEffect(() => {
    setCompletedQuests(new Set()); // Ensure quests start as not completed
    setUserProgress({}); // Reset any progress
  }, []);

  // Pre-defined quests with XP rewards
  const questCategories = [
    { id: 'all', name: 'All Quests', icon: SparklesIcon },
    { id: 'beginner', name: 'Beginner', icon: AcademicCapIcon },
    { id: 'intermediate', name: 'Intermediate', icon: CodeBracketIcon },
    { id: 'advanced', name: 'Advanced', icon: TrophyIcon },
    { id: 'github', name: 'GitHub', icon: StarIcon }
  ];

  const predefinedQuests = [
    {
      id: 1,
      title: "Git Fundamentals",
      description: "Learn the basics of version control with Git. Master init, add, commit, and push commands.",
      difficulty: "beginner",
      category: "git",
      xp_reward: 100,
      estimated_time: "30 minutes",
      tasks: [
        "Initialize a new Git repository",
        "Create your first commit",
        "Push to a remote repository"
      ],
      color: "from-green-500 to-emerald-500",
      icon: CodeBracketIcon
    },
    {
      id: 2,
      title: "JavaScript Arrays & Objects",
      description: "Master JavaScript data structures. Learn to manipulate arrays and work with objects effectively.",
      difficulty: "beginner", 
      category: "javascript",
      xp_reward: 150,
      estimated_time: "45 minutes",
      tasks: [
        "Create and manipulate arrays",
        "Work with array methods (map, filter, reduce)",
        "Build complex objects"
      ],
      color: "from-blue-500 to-indigo-500",
      icon: LightBulbIcon
    },
    {
      id: 3,
      title: "React Components",
      description: "Build reusable React components. Learn props, state, and component lifecycle.",
      difficulty: "intermediate",
      category: "react",
      xp_reward: 200,
      estimated_time: "1 hour",
      tasks: [
        "Create functional components",
        "Manage state with useState",
        "Pass and use props effectively"
      ],
      color: "from-cyan-500 to-blue-500",
      icon: RocketLaunchIcon
    },
    {
      id: 4,
      title: "GitHub Pull Requests",
      description: "Contribute to open source! Learn to fork repositories, make changes, and submit PRs.",
      difficulty: "intermediate",
      category: "github",
      xp_reward: 250,
      estimated_time: "1.5 hours",
      tasks: [
        "Fork a repository",
        "Create a feature branch",
        "Submit a pull request"
      ],
      color: "from-purple-500 to-pink-500",
      icon: StarIcon
    },
    {
      id: 5,
      title: "Algorithm Challenges",
      description: "Solve complex algorithmic problems. Improve your problem-solving and coding skills.",
      difficulty: "advanced",
      category: "algorithms",
      xp_reward: 300,
      estimated_time: "2 hours",
      tasks: [
        "Solve sorting algorithms",
        "Implement binary search",
        "Create dynamic programming solution"
      ],
      color: "from-red-500 to-orange-500",
      icon: TrophyIcon
    },
    {
      id: 6,
      title: "API Integration",
      description: "Learn to work with REST APIs. Fetch data, handle responses, and manage errors.",
      difficulty: "intermediate",
      category: "apis",
      xp_reward: 180,
      estimated_time: "1 hour",
      tasks: [
        "Make GET requests",
        "Handle async/await",
        "Implement error handling"
      ],
      color: "from-teal-500 to-cyan-500",
      icon: CodeBracketIcon
    },
    {
      id: 7,
      title: "Docker Fundamentals",
      description: "Containerize your applications with Docker. Learn images, containers, and Docker Compose.",
      difficulty: "advanced",
      category: "devops",
      xp_reward: 350,
      estimated_time: "2.5 hours",
      tasks: [
        "Create Dockerfile",
        "Build and run containers",
        "Use Docker Compose"
      ],
      color: "from-indigo-500 to-purple-500",
      icon: RocketLaunchIcon
    },
    {
      id: 8,
      title: "Database Design",
      description: "Design efficient databases. Learn SQL, relationships, and optimization techniques.",
      difficulty: "advanced",
      category: "database",
      xp_reward: 280,
      estimated_time: "2 hours",
      tasks: [
        "Design database schema",
        "Write complex SQL queries",
        "Optimize query performance"
      ],
      color: "from-yellow-500 to-orange-500",
      icon: CodeBracketIcon
    }
  ];

  const filteredQuests = selectedCategory === 'all' 
    ? predefinedQuests 
    : predefinedQuests.filter(quest => quest.difficulty === selectedCategory);

  const handleQuestComplete = (questId) => {
    setCompletedQuests(prev => new Set([...prev, questId]));
    // Add XP to user (this would integrate with your backend)
    const quest = predefinedQuests.find(q => q.id === questId);
    if (quest) {
      console.log(`Quest completed! +${quest.xp_reward} XP`);
      // You can add a toast notification here
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const getProgressPercent = (questId) => {
    return userProgress[questId] || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              🎯 Quest Hub
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Embark on coding adventures, earn XP, and level up your skills!
            </p>
            <div className="mt-8 flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <TrophyIcon className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium">Level {user?.level || 1}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <SparklesIcon className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium">{user?.total_xp || 0} XP</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <CheckCircleIcon className="w-5 h-5 text-green-300" />
                <span className="text-sm font-medium">{completedQuests.size} Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Category Filters */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quest Categories</h2>
          <div className="flex flex-wrap gap-4">
            {questCategories.map((category) => {
              const IconComponent = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'}
                  `}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {filteredQuests.map((quest) => {
            const IconComponent = quest.icon;
            const isCompleted = completedQuests.has(quest.id);
            const progressPercent = getProgressPercent(quest.id);
            
            return (
              <div key={quest.id} className="group">
                <div 
                  onClick={() => navigate(`/quests/${quest.id}`)}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                >
                  {/* Quest Header */}
                  <div className={`h-32 bg-gradient-to-br ${quest.color} p-6 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 flex items-center justify-between text-white">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(quest.difficulty)}`}>
                            {quest.difficulty}
                          </span>
                        </div>
                      </div>
                      {isCompleted && (
                        <CheckCircleSolid className="w-8 h-8 text-green-300" />
                      )}
                    </div>
                    <div className="absolute bottom-4 right-4 text-white/80">
                      <div className="flex items-center space-x-1">
                        <StarIcon className="w-4 h-4" />
                        <span className="text-sm font-semibold">{quest.xp_reward} XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Quest Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {quest.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {quest.description}
                    </p>

                    {/* Quest Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <ClockIcon className="w-4 h-4" />
                        <span className="text-xs">{quest.estimated_time}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <CheckCircleIcon className="w-4 h-4" />
                        <span className="text-xs">{quest.tasks.length} tasks</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-500">{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${quest.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Tasks Preview */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Tasks:</h4>
                      <ul className="space-y-1">
                        {quest.tasks.slice(0, 2).map((task, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-xs text-gray-600">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            <span>{task}</span>
                          </li>
                        ))}
                        {quest.tasks.length > 2 && (
                          <li className="text-xs text-gray-500 italic">
                            +{quest.tasks.length - 2} more tasks...
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => {
                        if (!isCompleted) {
                          // Navigate to interactive quest detail page
                          navigate(`/quests/${quest.id}`);
                        } else {
                          // If completed, still allow viewing the quest
                          navigate(`/quests/${quest.id}`);
                        }
                      }}
                      className={`
                        w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200
                        ${isCompleted 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : `bg-gradient-to-r ${quest.color} text-white hover:shadow-lg hover:scale-105 active:scale-95`
                        }
                      `}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircleSolid className="w-5 h-5" />
                          <span>View Quest</span>
                          <ArrowRightIcon className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <PlayIcon className="w-5 h-5" />
                          <span>Start Quest</span>
                          <ArrowRightIcon className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reward Information */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <GiftIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Rewards & XP System</h2>
              <p className="text-gray-600">Complete quests to earn experience points and unlock new challenges!</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-green-800">Beginner Quests</h3>
              </div>
              <p className="text-green-700 text-sm">50-150 XP per quest</p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <CodeBracketIcon className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-yellow-800">Intermediate Quests</h3>
              </div>
              <p className="text-yellow-700 text-sm">150-250 XP per quest</p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <TrophyIcon className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-red-800">Advanced Quests</h3>
              </div>
              <p className="text-red-700 text-sm">250-350 XP per quest</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quests;
