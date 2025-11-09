import React, { useState, useEffect } from 'react';
import { mockUser, getLevelFromXP, getProgressPercentage } from '../data/mockUser';
import './Analytics.css';

export default function Analytics() {
  const [user] = useState(mockUser);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setAnalyticsData({
          total_quests: user.quests_completed,
          total_xp: user.total_xp,
          level: user.level,
          current_streak: user.current_streak,
          longest_streak: user.longest_streak,
          badges_earned: user.badges.length,
          member_since: user.member_since,
          progress: {
            progress_percentage: getProgressPercentage(user.total_xp)
          }
        });
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
    }
  };

  if (loading || !analyticsData) {
    return <div className="loading">⏳ Loading analytics...</div>;
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>📊 Your Analytics</h1>
        <p>Track your progress and achievements</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <h3>Total XP Earned</h3>
          <p className="big-number">{analyticsData.total_xp.toLocaleString()}</p>
        </div>

        <div className="summary-card">
          <h3>Current Level</h3>
          <p className="big-number">{analyticsData.level}</p>
        </div>

        <div className="summary-card">
          <h3>Quests Completed</h3>
          <p className="big-number">{analyticsData.total_quests}</p>
        </div>

        <div className="summary-card">
          <h3>Active Streak</h3>
          <p className="big-number">{analyticsData.current_streak} 🔥</p>
        </div>
      </div>

      {/* Level Progress */}
      <div className="analytics-section">
        <h2>📈 Level Progress</h2>
        <div className="progress-card">
          <div className="progress-info">
            <span>Level {analyticsData.level}</span>
            <span>{analyticsData.progress.progress_percentage}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{width: analyticsData.progress.progress_percentage + '%'}}
            ></div>
          </div>
          <p className="progress-text">
            Progress towards Level {analyticsData.level + 1}
          </p>
        </div>
      </div>

      {/* Streaks */}
      <div className="analytics-section">
        <h2>🔥 Streaks</h2>
        <div className="streaks-grid">
          <div className="streak-box">
            <h3>Current Streak</h3>
            <p className="streak-number">{analyticsData.current_streak}</p>
            <p className="streak-label">days</p>
          </div>
          <div className="streak-box">
            <h3>Best Streak</h3>
            <p className="streak-number">{analyticsData.longest_streak}</p>
            <p className="streak-label">days</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="analytics-section">
        <h2>🎖️ Achievements</h2>
        <div className="achievements-grid">
          <div className="achievement-item">
            <span className="achievement-icon">✅</span>
            <h4>Quests Completed</h4>
            <p>{analyticsData.total_quests}</p>
          </div>
          <div className="achievement-item">
            <span className="achievement-icon">⚡</span>
            <h4>Total XP</h4>
            <p>{analyticsData.total_xp.toLocaleString()}</p>
          </div>
          <div className="achievement-item">
            <span className="achievement-icon">🎖️</span>
            <h4>Badges Earned</h4>
            <p>{analyticsData.badges_earned}</p>
          </div>
          <div className="achievement-item">
            <span className="achievement-icon">👑</span>
            <h4>Current Level</h4>
            <p>{analyticsData.level}</p>
          </div>
        </div>
      </div>

      {/* Membership */}
      <div className="analytics-section">
        <h2>📅 Membership</h2>
        <div className="membership-info">
          <p>Member for <strong>{analyticsData.member_since} months</strong></p>
          <p>Username: <strong>{user.username}</strong></p>
          <p>Email: <strong>{user.email}</strong></p>
        </div>
      </div>
    </div>
  );
}
