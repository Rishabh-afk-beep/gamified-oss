import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { getLevelFromXP, getProgressPercentage } from '../data/mockUser';
import './Analytics.css';

export default function Analytics() {
  const { user, isAuthenticated } = useAuth();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
    }
  }, [isAuthenticated]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📊 Fetching analytics data...');
      const data = await apiService.getAnalytics();
      console.log('✅ Analytics data received:', data);
      
      setAnalyticsData(data);
    } catch (err) {
      console.error('❌ Error fetching analytics:', err);
      setError(err.message);
      
      // Fallback to user data from auth context
      if (user) {
        console.log('🔄 Using fallback user data');
        setAnalyticsData({
          username: user.displayName || user.email,
          total_quests: user.quests_completed || 0,
          total_xp: user.total_xp || 0,
          level: user.level || 1,
          current_streak: user.current_streak || 0,
          longest_streak: user.longest_streak || 0,
          badges_earned: user.badges?.length || 0,
          member_since: user.created_at || new Date().toISOString(),
          progress: {
            progress_percentage: getProgressPercentage(user.total_xp || 0)
          }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to simulate completing a quest for testing
  const testCompleteQuest = async () => {
    try {
      console.log('🎯 Testing quest completion...');
      const result = await apiService.completeQuest('test-quest-id');
      console.log('✅ Quest completion result:', result);
      
      // Refresh analytics immediately
      await fetchAnalytics();
      
      alert(`Quest completed! You earned ${result.data?.xp_reward || 50} XP!`);
    } catch (err) {
      console.error('❌ Error completing quest:', err);
      alert('Error completing quest: ' + err.message);
    }
  };

  // Auto-refresh analytics every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing analytics...');
      fetchAnalytics();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="analytics-container">
        <div className="analytics-header">
          <h1>📊 Your Analytics</h1>
          <p>Please log in to view your progress and achievements</p>
        </div>
      </div>
    );
  }

  if (loading || !analyticsData) {
    return <div className="loading">⏳ Loading analytics...</div>;
  }

  if (error && !analyticsData) {
    return (
      <div className="analytics-container">
        <div className="error-message">
          <h2>❌ Error Loading Analytics</h2>
          <p>{error}</p>
          <button onClick={fetchAnalytics} className="retry-button">
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <div className="header-content">
          <h1>📊 Your Analytics</h1>
          <p>Track your progress and achievements</p>
        </div>
        <div className="header-actions">
          <button onClick={fetchAnalytics} className="refresh-button" disabled={loading}>
            🔄 {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button onClick={testCompleteQuest} className="test-button">
            🎯 Complete Test Quest
          </button>
        </div>
      </div>

      {error && (
        <div className="warning-banner">
          ⚠️ Using cached data. {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <h3>Total XP Earned</h3>
          <p className="big-number">{(analyticsData.total_xp || 0).toLocaleString()}</p>
        </div>

        <div className="summary-card">
          <h3>Current Level</h3>
          <p className="big-number">{analyticsData.level || 1}</p>
        </div>

        <div className="summary-card">
          <h3>Quests Completed</h3>
          <p className="big-number">{analyticsData.total_quests || 0}</p>
        </div>

        <div className="summary-card">
          <h3>Active Streak</h3>
          <p className="big-number">{analyticsData.current_streak || 0} 🔥</p>
        </div>
      </div>

      {/* Level Progress */}
      <div className="analytics-section">
        <h2>📈 Level Progress</h2>
        <div className="progress-card">
          <div className="progress-info">
            <span>Level {analyticsData.level || 1}</span>
            <span>{analyticsData.progress?.progress_percentage || 0}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{width: (analyticsData.progress?.progress_percentage || 0) + '%'}}
            ></div>
          </div>
          <p className="progress-text">
            Progress towards Level {(analyticsData.level || 1) + 1}
          </p>
        </div>
      </div>

      {/* Streaks */}
      <div className="analytics-section">
        <h2>🔥 Streaks</h2>
        <div className="streaks-grid">
          <div className="streak-box">
            <h3>Current Streak</h3>
            <p className="streak-number">{analyticsData.current_streak || 0}</p>
            <p className="streak-label">days</p>
          </div>
          <div className="streak-box">
            <h3>Best Streak</h3>
            <p className="streak-number">{analyticsData.longest_streak || 0}</p>
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
            <p>{analyticsData.total_quests || 0}</p>
          </div>
          <div className="achievement-item">
            <span className="achievement-icon">⚡</span>
            <h4>Total XP</h4>
            <p>{(analyticsData.total_xp || 0).toLocaleString()}</p>
          </div>
          <div className="achievement-item">
            <span className="achievement-icon">🎖️</span>
            <h4>Badges Earned</h4>
            <p>{analyticsData.badges_earned || 0}</p>
          </div>
          <div className="achievement-item">
            <span className="achievement-icon">👑</span>
            <h4>Current Level</h4>
            <p>{analyticsData.level || 1}</p>
          </div>
        </div>
      </div>

      {/* Membership */}
      <div className="analytics-section">
        <h2>📅 Membership</h2>
        <div className="membership-info">
          <p>Username: <strong>{analyticsData.username || user?.displayName || 'Unknown'}</strong></p>
          <p>Email: <strong>{user?.email || 'Not available'}</strong></p>
          <p>Member since: <strong>{analyticsData.member_since ? new Date(analyticsData.member_since).toLocaleDateString() : 'Unknown'}</strong></p>
        </div>
      </div>
    </div>
  );
}
