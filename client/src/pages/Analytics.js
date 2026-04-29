import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import '../styles/Analytics.css';

const Analytics = () => {
  const { token } = useContext(AuthContext);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [weekly, monthly, categories] = await Promise.all([
        API.get('/api/analytics/weekly', { headers: { Authorization: `Bearer ${token}` } }),
        API.get('/api/analytics/monthly', { headers: { Authorization: `Bearer ${token}` } }),
        API.get('/api/analytics/categories', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setWeeklyData(weekly.data);
      setMonthlyStats(monthly.data);
      setCategoryStats(categories.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading || !monthlyStats) {
    return <div className="loading">Loading analytics...</div>;
  }

  const categoryData = Object.entries(categoryStats || {}).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    completed: value.completed || 0,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));

  return (
    <div className="analytics-page">
      <div className="container">
        <h1>📊 Analytics & Insights</h1>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">✅</div>
            <div className="metric-info">
              <div className="metric-value">{monthlyStats.totalTasksCompleted}</div>
              <div className="metric-label">Tasks Completed</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">⭐</div>
            <div className="metric-info">
              <div className="metric-value">{monthlyStats.totalXPEarned}</div>
              <div className="metric-label">XP Earned</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">📈</div>
            <div className="metric-info">
              <div className="metric-value">{monthlyStats.level}</div>
              <div className="metric-label">Current Level</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">🔥</div>
            <div className="metric-info">
              <div className="metric-value">{monthlyStats.streakInfo.current}</div>
              <div className="metric-label">Current Streak</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">⏱️</div>
            <div className="metric-info">
              <div className="metric-value">{monthlyStats.avgCompletionTime}</div>
              <div className="metric-label">Avg Completion (min)</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">🎯</div>
            <div className="metric-info">
              <div className="metric-value">{monthlyStats.productivityScore}</div>
              <div className="metric-label">Productivity Score</div>
            </div>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="chart-container">
          <h2>Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="tasksCompleted"
                stroke="#667eea"
                strokeWidth={2}
                dot={{ fill: '#667eea', r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="xpEarned"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-2 mt-20">
          <div className="chart-container">
            <h2>Tasks by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, completed }) => `${name}: ${completed}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="completed"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="stats-summary">
            <h2>Monthly Summary</h2>
            <div className="summary-item">
              <span>Total Time Spent</span>
              <strong>{monthlyStats.totalTimeSpent} minutes</strong>
            </div>
            <div className="summary-item">
              <span>Longest Streak</span>
              <strong>{monthlyStats.streakInfo.longest} days</strong>
            </div>
            <div className="summary-item">
              <span>Productivity Score</span>
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{
                    width: `${monthlyStats.productivityScore}%`,
                    background: `linear-gradient(90deg, #667eea 0%, #764ba2 100%)`,
                  }}
                ></div>
              </div>
              <strong>{monthlyStats.productivityScore}/100</strong>
            </div>
            <div className="summary-item">
              <span>Avg Task Time</span>
              <strong>{monthlyStats.avgCompletionTime} minutes</strong>
            </div>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="card mt-20">
          <h2>Category Performance</h2>
          <div className="category-table">
            <div className="table-header-row">
              <div className="col">Category</div>
              <div className="col">Tasks Completed</div>
              <div className="col">XP Earned</div>
            </div>
            {Object.entries(categoryStats || {}).map(([category, stats]) => (
              <div key={category} className="table-data-row">
                <div className="col">{category.charAt(0).toUpperCase() + category.slice(1)}</div>
                <div className="col">{stats.completed || 0}</div>
                <div className="col">{stats.xp || 0} XP</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
