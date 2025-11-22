import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  HomeIcon,
  CommandLineIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  CodeBracketIcon,
  TrophyIcon,
  ChartBarIcon,
  AcademicCapIcon,
  ArrowLeftOnRectangleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  BoltIcon,
  FireIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  CommandLineIcon as CommandLineIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  CodeBracketIcon as CodeBracketIconSolid,
  TrophyIcon as TrophyIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
  BoltIcon as BoltIconSolid,
  FireIcon as FireIconSolid,
  PuzzlePieceIcon as PuzzlePieceIconSolid
} from '@heroicons/react/24/solid';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      label: 'Dashboard',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
      path: '/dashboard',
      section: 'main',
      badge: null
    },
    {
      label: 'Workflow',
      icon: CommandLineIcon,
      iconSolid: CommandLineIconSolid,
      path: '/workflow',
      section: 'main',
      badge: null
    },
    {
      label: 'Quests',
      icon: PuzzlePieceIcon,
      iconSolid: PuzzlePieceIconSolid,
      path: '/quests',
      section: 'main',
      badge: 'New'
    },
    {
      label: 'AI Chat',
      icon: BoltIcon,
      iconSolid: BoltIconSolid,
      path: '/ai-chat',
      section: 'learning',
      badge: 'AI'
    },
    {
      label: 'Code Reviewer',
      icon: CodeBracketIcon,
      iconSolid: CodeBracketIconSolid,
      path: '/code-reviewer',
      section: 'learning',
      badge: 'AI'
    },
    {
      label: 'Tutorials',
      icon: AcademicCapIcon,
      iconSolid: AcademicCapIconSolid,
      path: '/tutorials',
      section: 'learning',
      badge: null
    },
    {
      label: 'GitHub',
      icon: CodeBracketIcon,
      iconSolid: CodeBracketIconSolid,
      path: '/github',
      section: 'learning',
      badge: null
    },
    {
      label: 'Leaderboard',
      icon: TrophyIcon,
      iconSolid: TrophyIconSolid,
      path: '/leaderboard',
      section: 'stats',
      badge: null
    },
    {
      label: 'Analytics',
      icon: ChartBarIcon,
      iconSolid: ChartBarIconSolid,
      path: '/analytics',
      section: 'stats',
      badge: null
    }
  ];

  const sections = [
    { key: 'main', title: 'Main', icon: '🎮' },
    { key: 'learning', title: 'Learning', icon: '📚' },
    { key: 'stats', title: 'Progress', icon: '📊' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`flex flex-col h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-72'
    } border-r border-slate-700 shadow-2xl`}>
      
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <Link 
            to="/dashboard" 
            className="flex items-center gap-3 group transition-all duration-200"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-110">
              <span className="text-xl font-bold text-white">🚀</span>
            </div>
            {!isCollapsed && (
              <div className="transition-all duration-200">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  CodeQuest
                </h1>
                <p className="text-xs text-slate-400">Level up your skills</p>
              </div>
            )}
          </Link>
          
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all duration-200 border border-slate-600 hover:border-slate-500"
          >
            {isCollapsed ? (
              <ChevronDoubleRightIcon className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDoubleLeftIcon className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
        
        {/* User Info */}
        {!isCollapsed && user && (
          <div className="mt-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <UserCircleIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.display_name || user.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-slate-400">Level {Math.floor((user.total_xp || 0) / 1000) + 1}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">XP</div>
                <div className="text-sm font-bold text-yellow-400">{user.total_xp || 0}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        {sections.map((section) => {
          const sectionItems = menuItems.filter(item => item.section === section.key);
          
          return (
            <div key={section.key} className="mb-8">
              {!isCollapsed && (
                <div className="flex items-center gap-2 px-3 py-2 mb-3">
                  <span className="text-lg">{section.icon}</span>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {section.title}
                  </h3>
                </div>
              )}
              
              <div className="space-y-1">
                {sectionItems.map((item, index) => {
                  const active = isActive(item.path);
                  const Icon = active ? item.iconSolid : item.icon;
                  
                  return (
                    <Link
                      key={index}
                      to={item.path}
                      className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                        active 
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                      title={isCollapsed ? item.label : ''}
                    >
                      {/* Active indicator */}
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full" />
                      )}
                      
                      {/* Icon */}
                      <div className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${
                        active 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                          : 'bg-slate-800/50 group-hover:bg-slate-700 border border-slate-700 group-hover:border-slate-600'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      {/* Label and Badge */}
                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between">
                          <span className="font-medium">{item.label}</span>
                          {item.badge && (
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                              item.badge === 'New' 
                                ? 'bg-green-500 text-white' 
                                : item.badge === 'AI'
                                ? 'bg-purple-500 text-white'
                                : 'bg-blue-500 text-white'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Hover effect for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap border border-slate-700">
                          {item.label}
                          {item.badge && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-500 rounded">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 text-slate-400 hover:text-white hover:bg-red-500/10 rounded-xl transition-all duration-200 group border border-transparent hover:border-red-500/30"
        >
          <div className="flex-shrink-0 p-2 rounded-lg bg-slate-800/50 group-hover:bg-red-500/20 border border-slate-700 group-hover:border-red-500/30 transition-all duration-200">
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <span className="font-medium">Logout</span>
          )}
        </button>
        
        {!isCollapsed && (
          <div className="mt-3 text-center">
            <p className="text-xs text-slate-500">© 2024 CodeQuest</p>
            <p className="text-xs text-slate-600">Version 1.0.0</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;