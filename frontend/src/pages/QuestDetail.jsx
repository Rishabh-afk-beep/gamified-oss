import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  PlayIcon,
  ClockIcon,
  StarIcon,
  LightBulbIcon,
  CodeBracketIcon,
  BookOpenIcon,
  AcademicCapIcon,
  SparklesIcon,
  FireIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

export default function QuestDetail() {
  const navigate = useNavigate();
  const [quest, setQuest] = useState(null);
  const [progress, setProgress] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const questId = 'quest_1_github_explorer'; // Can be from URL params

  useEffect(() => {
    fetchQuestAndProgress();
  }, []);

  const fetchQuestAndProgress = async () => {
    try {
      setLoading(true);
      const questRes = await api.get(`/quests-system/${questId}`);
      const progressRes = await api.get(`/quests-system/user/demo_user/progress/${questId}`);

      if (questRes.data.success) {
        setQuest(questRes.data.quest);
      }
      if (progressRes.data.success) {
        setProgress(progressRes.data.progress);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId) => {
    try {
      const response = await api.post('/quests-system/complete-task', {
        quest_id: questId,
        task_id: taskId,
        user_id: 'demo_user'
      });

      if (response.data.success) {
        alert(`✅ Task completed! +${response.data.task_xp} XP`);
        
        if (response.data.new_badges?.length > 0) {
          alert(`🎉 New badge earned: ${response.data.new_badges.join(', ')}`);
        }

        fetchQuestAndProgress();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error completing task');
    }
  };

  if (loading) {
    return <div className="loading">Loading quest...</div>;
  }

  if (!quest) {
    return <div className="error">Quest not found</div>;
  }

  const completedTasks = progress?.tasks_completed || 0;
  const totalTasks = quest.tasks.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  return (
    <div className="quest-detail-container">
      {/* Header */}
      <div className="detail-header">
        <button className="btn-back" onClick={() => navigate('/quest-map')}>
          ← Back to Map
        </button>
        <h1>{quest.title}</h1>
        <p>{quest.description}</p>
      </div>

      {/* Progress Overview */}
      <div className="progress-overview">
        <div className="progress-card">
          <h3>Progress</h3>
          <div className="progress-large">
            <div className="progress-ring">
              <svg width="150" height="150">
                <circle cx="75" cy="75" r="70" />
                <circle 
                  cx="75" 
                  cy="75" 
                  r="70" 
                  style={{
                    strokeDasharray: `${(progressPercentage / 100) * 440} 440`,
                    strokeDashoffset: '0'
                  }}
                />
              </svg>
              <div className="progress-text">{completedTasks}/{totalTasks}</div>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <h3>Statistics</h3>
          <div className="stat-row">
            <span>Total XP:</span>
            <span className="xp-value">{progress?.xp_earned || 0}/{quest.total_xp}</span>
          </div>
          <div className="stat-row">
            <span>Status:</span>
            <span className={`status ${progress?.status}`}>
              {progress?.status === 'completed' ? '✓ Completed' : '⟳ In Progress'}
            </span>
          </div>
          <div className="stat-row">
            <span>Estimated Time:</span>
            <span>{quest.estimated_time}</span>
          </div>
        </div>

        <div className="learning-card">
          <h3>📚 Learning Outcomes</h3>
          <ul>
            {quest.learning_outcomes.map((outcome, idx) => (
              <li key={idx}>{outcome}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tasks List */}
      <div className="tasks-section">
        <h2>Tasks ({completedTasks}/{totalTasks})</h2>
        <div className="tasks-grid">
          {quest.tasks.map((task, idx) => {
            const taskProgress = progress?.task_progress?.[task.id];
            const isCompleted = taskProgress?.status === 'completed';

            return (
              <div 
                key={task.id}
                className={`task-card ${isCompleted ? 'completed' : ''}`}
                onClick={() => {
                  setSelectedTask(task);
                  setShowTaskDetail(true);
                }}
              >
                <div className="task-header">
                  <span className="task-number">{idx + 1}</span>
                  <span className="task-status">
                    {isCompleted ? '✓' : '○'}
                  </span>
                </div>

                <h3>{task.title}</h3>
                <p>{task.description}</p>

                <div className="task-footer">
                  <span className="difficulty">{task.difficulty}</span>
                  <span className="xp">{task.xp_reward}XP</span>
                </div>

                {!isCompleted && (
                  <button 
                    className="btn-start-task"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTask(task);
                      setShowTaskDetail(true);
                    }}
                  >
                    Start Task →
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Detail Modal */}
      {showTaskDetail && selectedTask && (
        <div className="task-modal-overlay" onClick={() => setShowTaskDetail(false)}>
          <div className="task-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowTaskDetail(false)}>×</button>

            <h2>{selectedTask.title}</h2>

            <div className="task-detail-content">
              <div className="instruction-section">
                <h3>📋 Instructions</h3>
                <div className="instructions">
                  {selectedTask.instructions.split('\n').map((line, idx) => {
                    if (line.startsWith('###')) {
                      return <h4 key={idx}>{line.substring(4)}</h4>;
                    } else if (line.startsWith('##')) {
                      return <h3 key={idx}>{line.substring(3)}</h3>;
                    } else if (line.startsWith('#')) {
                      return <h2 key={idx}>{line.substring(2)}</h2>;
                    } else if (line.startsWith('- ')) {
                      return <li key={idx}>{line.substring(2)}</li>;
                    } else if (line.trim().startsWith('```')) {
                      return <pre key={idx} className="code-block">{line}</pre>;
                    } else if (line.trim()) {
                      return <p key={idx}>{line}</p>;
                    }
                    return null;
                  })}
                </div>
              </div>

              <div className="task-info-box">
                <div className="info-item">
                  <span className="label">Difficulty:</span>
                  <span className="value">{selectedTask.difficulty}</span>
                </div>
                <div className="info-item">
                  <span className="label">XP Reward:</span>
                  <span className="value xp">{selectedTask.xp_reward}</span>
                </div>
                <div className="info-item">
                  <span className="label">Validation:</span>
                  <span className="value">{selectedTask.validation_type}</span>
                </div>
              </div>

              <button 
                className="btn-complete-task"
                onClick={() => {
                  completeTask(selectedTask.id);
                  setShowTaskDetail(false);
                }}
              >
                ✓ Mark as Completed
              </button>

              <button 
                className="btn-cancel"
                onClick={() => setShowTaskDetail(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
