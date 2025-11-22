import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { questService } from '../services/questService';
import { apiService } from '../services/api';
import { 
  ChartBarIcon, 
  TrophyIcon, 
  FireIcon, 
  ClockIcon,
  StarIcon,
  ArrowRightIcon,
  UserIcon,
  AcademicCapIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [quests, setQuests] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch quests and analytics in parallel
      const [questsResponse, analyticsResponse] = await Promise.allSettled([
        questService.getAllQuests(),
        apiService.getAnalytics().catch(() => null) // Don't fail if analytics fails
      ]);

      if (questsResponse.status === 'fulfilled') {
        const questsData = questsResponse.value;
        // Handle different response formats from backend
        if (questsData?.quests && Array.isArray(questsData.quests)) {
          setQuests(questsData.quests);
        } else if (Array.isArray(questsData)) {
          setQuests(questsData);
        } else {
          console.warn('Unexpected quests data format:', questsData);
          setQuests([]);
        }
      } else {
        console.error('Failed to fetch quests:', questsResponse.reason);
        setQuests([]);
      }

      if (analyticsResponse.status === 'fulfilled' && analyticsResponse.value) {
        setAnalytics(analyticsResponse.value.data || analyticsResponse.value);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateLevelProgress = () => {
    if (!user?.total_xp) return { level: 1, progress: 0, xpToNext: 1000 };
    
    const xp = user.total_xp;
    const level = Math.floor(xp / 1000) + 1;
    const currentLevelXP = xp % 1000;
    const progress = (currentLevelXP / 1000) * 100;
    const xpToNext = 1000 - currentLevelXP;
    
    return { level, progress, xpToNext };
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getRecentQuests = () => {
    if (!Array.isArray(quests)) {
      console.warn('Quests is not an array:', quests);
      return [];
    }
    return quests.slice(0, 3);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full"></div>
                  <div>
                    <div className="h-10 bg-white bg-opacity-20 rounded w-80 mb-3"></div>
                    <div className="h-6 bg-white bg-opacity-20 rounded w-60"></div>
                  </div>
                </div>
                <div className="hidden md:block bg-white bg-opacity-10 rounded-2xl p-6">
                  <div className="h-4 bg-white bg-opacity-20 rounded w-24 mb-2"></div>
                  <div className="h-12 bg-white bg-opacity-20 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats skeleton */}
          <div className="max-w-7xl mx-auto px-4 -mt-20 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-13 h-13 bg-gray-200 rounded-xl"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border border-gray-200 rounded-xl p-6">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded-xl"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { level, progress, xpToNext } = calculateLevelProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10 transform -skew-y-6"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl">🎮</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text">
                    {getGreeting()}, {user?.display_name || user?.email?.split('@')[0] || 'Coder'}!
                  </h1>
                  <p className="text-blue-100 text-lg font-medium">
                    {user?.email}
                  </p>
                </div>
              </div>
              <p className="text-blue-100 text-base max-w-lg">
                🚀 Ready to level up your coding skills? Complete quests, earn XP, and climb the leaderboard!
              </p>
            </div>
            <div className="hidden md:block">
              <div className="text-right bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                <div className="text-sm text-blue-100 uppercase tracking-wide font-semibold mb-1">Current Level</div>
                <div className="text-5xl font-bold text-white">{level}</div>
                <div className="text-xs text-blue-200 mt-2">
                  {progress.toFixed(1)}% to next level
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Level Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl shadow-lg">
                <TrophyIcon className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{level}</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-3 text-lg">Level</h3>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full transition-all duration-700 ease-out shadow-sm" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 font-medium">{xpToNext} XP to Level {level + 1}</p>
          </div>

          {/* Total XP */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-gradient-to-r from-red-400 to-red-600 rounded-xl shadow-lg">
                <FireIcon className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{user?.total_xp || 0}</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-1 text-lg">Total XP</h3>
            <p className="text-sm text-gray-600 font-medium">Experience Points</p>
          </div>

          {/* Streak */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-gradient-to-r from-green-400 to-green-600 rounded-xl shadow-lg">
                <ClockIcon className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-gray-900">{user?.current_streak || 0}</span>
                {(user?.current_streak || 0) > 0 && <span className="text-lg">🔥</span>}
              </div>
            </div>
            <h3 className="font-bold text-gray-900 mb-1 text-lg">Streak</h3>
            <p className="text-sm text-gray-600 font-medium">Days Active</p>
          </div>

          {/* Completed Quests */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl shadow-lg">
                <CheckCircleIcon className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{user?.completed_quests?.length || 0}</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-1 text-lg">Quests</h3>
            <p className="text-sm text-gray-600 font-medium">Completed</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Quests */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Continue Your Journey</h2>
                    <p className="text-gray-600">Pick up where you left off</p>
                  </div>
                  <button 
                    onClick={() => navigate('/quests')}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    View all
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-8">
                {getRecentQuests().length > 0 ? (
                  <div className="space-y-6">
                    {getRecentQuests().map((quest, index) => (
                      <div 
                        key={quest.id} 
                        className="group border-2 border-gray-100 rounded-xl p-6 hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-lg"
                        onClick={() => navigate(`/quests/${quest.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                                {index + 1}
                              </div>
                              <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">{quest.title}</h3>
                            </div>
                            <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{quest.description}</p>
                            <div className="flex items-center gap-6">
                              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                quest.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                                quest.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {quest.difficulty}
                              </span>
                              <span className="text-gray-600 flex items-center gap-2 font-medium">
                                <StarIcon className="w-5 h-5 text-yellow-500" />
                                {quest.xp_reward} XP
                              </span>
                            </div>
                          </div>
                          <div className="ml-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRightIcon className="w-6 h-6 text-blue-500" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AcademicCapIcon className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">No quests available</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">Check back later for new coding challenges! We're constantly adding new quests to help you improve your skills.</p>
                    <button 
                      onClick={() => navigate('/quests')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Browse Available Quests
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <h3 className="font-bold text-gray-900 mb-6 text-xl">Quick Actions</h3>
              <div className="space-y-4">
                <button 
                  onClick={() => navigate('/quests')}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <AcademicCapIcon className="w-6 h-6" />
                  Browse Quests
                </button>
                <button 
                  onClick={() => navigate('/leaderboard')}
                  className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-6 py-4 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <ChartBarIcon className="w-6 h-6" />
                  View Leaderboard
                </button>
                <button 
                  onClick={() => navigate('/badges')}
                  className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-6 py-4 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <TrophyIcon className="w-6 h-6" />
                  My Badges
                </button>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <h3 className="font-bold text-gray-900 mb-6 text-xl">Recent Badges</h3>
              {user?.badges && user.badges.length > 0 ? (
                <div className="space-y-4">
                  {user.badges.slice(0, 3).map((badge, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 hover:shadow-md transition-all duration-200">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                        <TrophyIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{badge.name || 'Achievement'}</div>
                        <div className="text-sm text-gray-600">Recently earned</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrophyIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">No badges yet</h4>
                  <p className="text-sm text-gray-600 mb-4">Complete quests to earn your first badge!</p>
                  <button 
                    onClick={() => navigate('/quests')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Start Quest
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl shadow-2xl border border-red-400 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">!</span>
            </div>
            <div>
              <div className="font-semibold">Error</div>
              <div className="text-sm opacity-90">{error}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;