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
        setQuests(questsResponse.value || []);
      }

      if (analyticsResponse.status === 'fulfilled' && analyticsResponse.value) {
        setAnalytics(analyticsResponse.value.data);
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
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="h-8 bg-white bg-opacity-20 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-white bg-opacity-20 rounded w-1/4"></div>
            </div>
          </div>
          
          {/* Stats skeleton */}
          <div className="max-w-7xl mx-auto px-4 -mt-16 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { level, progress, xpToNext } = calculateLevelProgress();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {getGreeting()}, {user?.display_name || user?.email?.split('@')[0] || 'Coder'}! 🎮
              </h1>
              <p className="text-blue-100 text-lg">
                {user?.email}
              </p>
              <p className="text-blue-100 text-sm mt-1">
                Ready to level up your coding skills?
              </p>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <div className="text-sm text-blue-100">Current Level</div>
                <div className="text-4xl font-bold">{level}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Level Progress */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrophyIcon className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{level}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Level</h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-orange-400 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{xpToNext} XP to Level {level + 1}</p>
          </div>

          {/* Total XP */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <FireIcon className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{user?.total_xp || 0}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Total XP</h3>
            <p className="text-sm text-gray-600">Experience Points</p>
          </div>

          {/* Streak */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{user?.current_streak || 0}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Streak</h3>
            <p className="text-sm text-gray-600">Days Active</p>
          </div>

          {/* Completed Quests */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{user?.completed_quests?.length || 0}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Quests</h3>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Quests */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Continue Your Journey</h2>
                  <button 
                    onClick={() => navigate('/quests')}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                  >
                    View all
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {getRecentQuests().length > 0 ? (
                  <div className="space-y-4">
                    {getRecentQuests().map((quest) => (
                      <div 
                        key={quest.id} 
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                        onClick={() => navigate(`/quests/${quest.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">{quest.title}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{quest.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                quest.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                quest.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {quest.difficulty}
                              </span>
                              <span className="text-gray-500 flex items-center gap-1">
                                <StarIcon className="w-4 h-4" />
                                {quest.xp_reward} XP
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AcademicCapIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No quests available</h3>
                    <p className="text-gray-600">Check back later for new coding challenges!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/quests')}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Browse Quests
                </button>
                <button 
                  onClick={() => navigate('/leaderboard')}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  View Leaderboard
                </button>
                <button 
                  onClick={() => navigate('/badges')}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  My Badges
                </button>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Recent Badges</h3>
              {user?.badges && user.badges.length > 0 ? (
                <div className="space-y-3">
                  {user.badges.slice(0, 3).map((badge, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <TrophyIcon className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{badge.name || 'Achievement'}</div>
                        <div className="text-xs text-gray-500">Recently earned</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <TrophyIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No badges yet. Complete quests to earn your first badge!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default Dashboard;