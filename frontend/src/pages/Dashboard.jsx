import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questService } from '../services/questService';
import { mockUser, getLevelFromXP, getProgressPercentage } from '../data/mockUser';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(mockUser);
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLevelUpMessage, setShowLevelUpMessage] = useState(false);
  const [levelUpMessage, setLevelUpMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await questService.getQuests();
      setQuests(response.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Complete a quest and award XP
   */
  const completeQuest = async (questId) => {
    try {
      console.log('🎯 Completing quest:', questId);
      
      // Find the quest to get XP reward
      const quest = quests.find(q => (q._id || q.id) === questId);
      if (!quest) {
        alert('Quest not found');
        return;
      }
      
      const xpReward = quest.xp_reward || 100;
      const newTotalXP = user.total_xp + xpReward;
      const newLevel = getLevelFromXP(newTotalXP);
      const oldLevel = user.level;
      
      // Check if level up
      const leveledUp = newLevel > oldLevel;
      
      // Update user
      setUser(prev => ({
        ...prev,
        total_xp: newTotalXP,
        level: newLevel,
        current_streak: Math.min(prev.current_streak + 1, 365),
        quests_completed: prev.quests_completed + 1
      }));
      
      // Show appropriate message
      if (leveledUp) {
        setLevelUpMessage(`🎉 LEVEL UP! You're now Level ${newLevel}!`);
        setShowLevelUpMessage(true);
        setTimeout(() => setShowLevelUpMessage(false), 3000);
      } else {
        alert(`✅ Quest completed!\n+${xpReward} XP\n\nTotal XP: ${newTotalXP}`);
      }
      
      console.log(`✅ Quest completed! New XP: ${newTotalXP}, Level: ${newLevel}`);
    } catch (err) {
      console.error('Error completing quest:', err);
      alert('Failed to complete quest');
    }
  };

  /**
   * Calculate progress to next level
   */
  const getProgress = () => {
    return getProgressPercentage(user.total_xp);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">⏳ Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Level Up Message */}
      {showLevelUpMessage && (
        <div className="level-up-popup">
          <div className="level-up-content">
            {levelUpMessage}
            <div className="confetti">🎉</div>
          </div>
        </div>
      )}

      {/* User Header */}
      <div className="user-header">
        <div className="user-card">
          <div className="user-avatar">
            <img src={user.avatar_url} alt={user.username} />
          </div>
          
          <div className="user-info">
            <h1>Welcome back, {user.username}! 🎮</h1>
            <p className="user-email">{user.email}</p>
            <p className="member-since">Member for {user.member_since} months</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {/* Level Card */}
        <div className="stat-card level-card">
          <div className="stat-icon">👑</div>
          <div className="stat-content">
            <h3>Level</h3>
            <p className="stat-value">{user.level}</p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{width: getProgress() + '%'}}
              ></div>
            </div>
            <p className="progress-text">
              {getProgress()}% to Level {user.level + 1}
            </p>
          </div>
        </div>

        {/* Total XP Card */}
        <div className="stat-card xp-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3>Total XP</h3>
            <p className="stat-value">{user.total_xp.toLocaleString()}</p>
            <p className="stat-subtitle">Experience Points</p>
          </div>
        </div>

        {/* Current Streak Card */}
        <div className="stat-card streak-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>Streak</h3>
            <p className="stat-value">{user.current_streak}</p>
            <p className="stat-subtitle">Days active</p>
          </div>
        </div>

        {/* Quests Completed Card */}
        <div className="stat-card quests-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Quests</h3>
            <p className="stat-value">{user.quests_completed}</p>
            <p className="stat-subtitle">Completed</p>
          </div>
        </div>

        {/* Longest Streak Card */}
        <div className="stat-card longest-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3>Best Streak</h3>
            <p className="stat-value">{user.longest_streak}</p>
            <p className="stat-subtitle">Personal best</p>
          </div>
        </div>

        {/* Badges Card */}
        <div className="stat-card badges-card">
          <div className="stat-icon">🎖️</div>
          <div className="stat-content">
            <h3>Badges</h3>
            <p className="stat-value">{user.badges.length}</p>
            <p className="stat-subtitle">Earned</p>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="badges-section">
        <h2>🎖️ Your Badges</h2>
        <div className="badges-container">
          {user.badges && user.badges.length > 0 ? (
            user.badges.map((badge, idx) => (
              <div key={idx} className="badge-item" title={badge}>
                🏅
              </div>
            ))
          ) : (
            <p>Complete quests to earn badges!</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button onClick={() => navigate('/quests')} className="btn-action">
          📚 View All Quests
        </button>
        <button onClick={() => navigate('/leaderboard')} className="btn-action">
          🏆 Leaderboard
        </button>
        <button onClick={() => navigate('/analytics')} className="btn-action">
          📊 Analytics
        </button>
      </div>

      {/* Available Quests */}
      <div className="available-quests">
        <h2>📚 Recommended Quests</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        {quests.length > 0 ? (
          <div className="quests-grid">
            {quests.slice(0, 3).map((quest) => (
              <div key={quest._id || quest.id} className="quest-item">
                <div className="quest-header">
                  <h3>{quest.title}</h3>
                  <span className={`difficulty-badge ${quest.difficulty}`}>
                    {quest.difficulty}
                  </span>
                </div>
                
                <p className="quest-description">{quest.description}</p>
                
                <div className="quest-stats">
                  <span>⚡ {quest.xp_reward} XP</span>
                  <span>⏱️ {quest.estimated_duration}m</span>
                </div>
                
                <button 
                  onClick={() => completeQuest(quest._id || quest.id)}
                  className="btn-complete-quest"
                >
                  ▶ Complete Quest
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No quests available yet.</p>
        )}
      </div>
    </div>
  );
}
