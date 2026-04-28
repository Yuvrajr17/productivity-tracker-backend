import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { token, user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchTasks();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/users/gamification/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return <div className="loading">Loading...</div>;
  }

  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Welcome back, {stats.username}! 🚀</h1>

        {/* Gamification Stats */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalXP}</div>
              <div className="stat-label">Total XP</div>
            </div>
          </div>

          <div className="stat-card secondary">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-value">{stats.level}</div>
              <div className="stat-label">Level</div>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-value">{stats.currentStreak}</div>
              <div className="stat-label">Current Streak</div>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-value">{stats.longestStreak}</div>
              <div className="stat-label">Longest Streak</div>
            </div>
          </div>
        </div>

        {/* Progress to Next Level */}
        <div className="card mt-20">
          <h2>Progress to Level {stats.xpToNextLevel.currentLevel + 1}</h2>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${(stats.xpToNextLevel.xpEarnedInCurrentLevel / stats.xpToNextLevel.xpNeededForCurrentLevel) * 100}%`,
              }}
            ></div>
          </div>
          <p className="progress-text">
            {stats.xpToNextLevel.xpEarnedInCurrentLevel} / {stats.xpToNextLevel.xpNeededForCurrentLevel} XP
          </p>
        </div>

        {/* Task Summary */}
        <div className="grid grid-2 mt-20">
          <div className="card">
            <h3>📊 Task Summary</h3>
            <div className="summary-stat">
              <span>Total Tasks:</span>
              <strong>{tasks.length}</strong>
            </div>
            <div className="summary-stat">
              <span>Completed:</span>
              <strong className="success">{completedTasks}</strong>
            </div>
            <div className="summary-stat">
              <span>Pending:</span>
              <strong className="warning">{pendingTasks}</strong>
            </div>
          </div>

          <div className="card">
            <h3>🎖️ Badges Earned</h3>
            <div className="badges-container">
              {stats.badges.length > 0 ? (
                stats.badges.slice(0, 6).map((badge, idx) => (
                  <div key={idx} className="badge-item" title={badge.description}>
                    <span className="badge-icon">{badge.icon}</span>
                    <span className="badge-name">{badge.name}</span>
                  </div>
                ))
              ) : (
                <p className="no-badges">Complete tasks to earn badges!</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="card mt-20">
          <h3>📋 Recent Tasks</h3>
          {tasks.length === 0 ? (
            <p className="no-tasks">No tasks yet. Create one to get started! 🎯</p>
          ) : (
            <div className="task-list">
              {tasks.slice(0, 5).map((task) => (
                <div key={task._id} className="task-item">
                  <div className="task-checkbox">
                    {task.completed ? <span>✓</span> : <span>○</span>}
                  </div>
                  <div className="task-info">
                    <h4 className={task.completed ? 'completed' : ''}>{task.title}</h4>
                    <div className="task-meta">
                      <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                      <span className={`badge badge-category`}>{task.category}</span>
                    </div>
                  </div>
                  <div className="task-xp">+{task.actualXPEarned || task.baseXP} XP</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
