import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard'
    },
    {
      label: 'Workflow',
      icon: '🔄',
      path: '/workflow'

    },
    {
      label: 'Quests',
      icon: '🎯',
      path: '/quests'
    },
    {
      label: 'Quest Map',
      icon: '🗺️',
      path: '/quest-map'
    },
    {
      label: 'AI Chat',
      icon: '🤖',
      path: '/ai-chat'
    },
    {
      label: 'Tutorials',
      icon: '📚',
      path: '/tutorials'
    },
    {
      label: 'GitHub',
      icon: '🐙',
      path: '/github'
    },
    {
      label: 'Code Challenges',
      icon: '💻',
      path: '/code-challenges'
    },
    {
      label: 'Leaderboard',
      icon: '🏆',
      path: '/leaderboard'
    },
    {
      label: 'Stats',
      icon: '🎮',
      path: '/gamification-stats'
    },
    {
      label: 'Analytics',
      icon: '📈',
      path: '/analytics'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    navigate('/');
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <Link to="/dashboard" className="logo">
          {!isCollapsed && (
            <>
              <span className="logo-icon">🚀</span>
              <span className="logo-text">CodeQuest</span>
            </>
          )}
          {isCollapsed && <span className="logo-icon-small">CQ</span>}
        </Link>
        <button 
          className="toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="sidebar-nav">
        <div className="menu-section">
          {!isCollapsed && <p className="section-title">Main</p>}
          {menuItems.slice(0, 5).map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <span className="menu-icon">{item.icon}</span>
              {!isCollapsed && <span className="menu-label">{item.label}</span>}
            </Link>
          ))}
        </div>

        <div className="menu-section">
          {!isCollapsed && <p className="section-title">Learning</p>}
          {menuItems.slice(5, 8).map((item, idx) => (
            <Link
              key={idx + 5}
              to={item.path}
              className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <span className="menu-icon">{item.icon}</span>
              {!isCollapsed && <span className="menu-label">{item.label}</span>}
            </Link>
          ))}
        </div>

        <div className="menu-section">
          {!isCollapsed && <p className="section-title">Stats & Social</p>}
          {menuItems.slice(8).map((item, idx) => (
            <Link
              key={idx + 8}
              to={item.path}
              className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <span className="menu-icon">{item.icon}</span>
              {!isCollapsed && <span className="menu-label">{item.label}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button 
          className="logout-btn"
          onClick={handleLogout}
          title="Logout"
        >
          <span className="menu-icon">🚪</span>
          {!isCollapsed && <span className="menu-label">Logout</span>}
        </button>
      </div>
    </div>
  );
}
