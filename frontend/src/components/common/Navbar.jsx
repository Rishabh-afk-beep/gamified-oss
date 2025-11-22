import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaGithub } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';




const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', authenticated: true },
    { path: '/quests', label: 'Quests', authenticated: true },
    { path: '/leaderboard', label: 'Leaderboard', authenticated: true },
    { path: '/ai-chat', label: '🤖 AI Chat', authenticated: true },
    { path: '/gamification-stats', label: '🎮 Stats', authenticated: true },
    { path: '/analytics', label: 'Analytics', authenticated: true },
     { path: '/github', label: <><FaGithub className="inline mr-1" /> GitHub</>, authenticated: true }, // ✅ added
     { path: '/tutorials', label: '📚 Tutorials', authenticated: true },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">CodeQuest</span>
            <span className="text-2xl">🚀</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated && navLinks
              .filter(link => link.authenticated)
              .map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
          </div>

          {/* User Menu / Auth Button */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {user?.avatar_url && (
                    <img 
                      src={user.avatar_url} 
                      alt={user.username}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700">{user?.username}</span>
                </div>
                <Link to="/profile" className="text-gray-700 hover:text-primary-600 transition-colors">
                  <FaUser />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-danger hover:bg-red-600 rounded-lg transition-colors"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            ) : (
              <Link to="/" className="px-6 py-2 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-700 hover:text-primary-600 transition-colors"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {isAuthenticated && navLinks
              .filter(link => link.authenticated)
              .map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            {isAuthenticated && (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaUser className="inline mr-2" /> Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaSignOutAlt className="inline mr-2" /> Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
