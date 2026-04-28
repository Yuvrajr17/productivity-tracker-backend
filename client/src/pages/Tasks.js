import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { FiTrash2, FiEdit2, FiCheck } from 'react-icons/fi';
import '../styles/Tasks.css';

const Tasks = () => {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'personal',
    priority: 'medium',
    baseXP: 10,
    estimatedTime: 30,
    tags: [],
  });
  const [filter, setFilter] = useState({ completed: 'all', category: 'all' });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      let url = '/api/tasks?';
      if (filter.completed !== 'all') {
        url += `completed=${filter.completed === 'completed'}&`;
      }
      if (filter.category !== 'all') {
        url += `category=${filter.category}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!newTask.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    try {
      const response = await axios.post('/api/tasks', newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks([response.data.task, ...tasks]);
      setNewTask({
        title: '',
        description: '',
        category: 'personal',
        priority: 'medium',
        baseXP: 10,
        estimatedTime: 30,
        tags: [],
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    }
  };

  const handleCompleteTask = async (taskId, completed) => {
    try {
      const response = await axios.put(
        `/api/tasks/${taskId}`,
        { completed: !completed },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTasks(tasks.map((t) => (t._id === taskId ? response.data.task : t)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTasks(tasks.filter((t) => t._id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#64748b';
    }
  };

  return (
    <div className="tasks-page">
      <div className="container">
        <div className="tasks-header">
          <h1>📋 My Tasks</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Create Task'}
          </button>
        </div>

        {showForm && (
          <div className="card create-task-form">
            <h2>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-grid">
                <div className="input-group">
                  <label>Task Title *</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="What do you need to do?"
                  />
                </div>

                <div className="input-group">
                  <label>Category</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  >
                    <option value="work">Work</option>
                    <option value="health">Health</option>
                    <option value="learning">Learning</option>
                    <option value="personal">Personal</option>
                    <option value="fitness">Fitness</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Base XP</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={newTask.baseXP}
                    onChange={(e) => setNewTask({ ...newTask, baseXP: parseInt(e.target.value) })}
                  />
                </div>

                <div className="input-group">
                  <label>Estimated Time (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={newTask.estimatedTime}
                    onChange={(e) => setNewTask({ ...newTask, estimatedTime: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Add more details..."
                  rows="4"
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary">
                Create Task
              </button>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="filters">
          <select
            value={filter.completed}
            onChange={(e) => setFilter({ ...filter, completed: e.target.value })}
          >
            <option value="all">All Tasks</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          >
            <option value="all">All Categories</option>
            <option value="work">Work</option>
            <option value="health">Health</option>
            <option value="learning">Learning</option>
            <option value="personal">Personal</option>
            <option value="fitness">Fitness</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found. Create one to get started! 🎯</p>
          </div>
        ) : (
          <div className="tasks-list">
            {tasks.map((task) => (
              <div key={task._id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                <div className="task-checkbox">
                  <button
                    className="checkbox-btn"
                    onClick={() => handleCompleteTask(task._id, task.completed)}
                  >
                    {task.completed ? <FiCheck size={20} /> : <span></span>}
                  </button>
                </div>

                <div className="task-content">
                  <h3>{task.title}</h3>
                  {task.description && <p className="task-description">{task.description}</p>}

                  <div className="task-badges">
                    <span
                      className="badge-priority"
                      style={{ borderLeftColor: getPriorityColor(task.priority) }}
                    >
                      {task.priority}
                    </span>
                    <span className="badge-category">{task.category}</span>
                    {task.estimatedTime && <span className="badge-time">⏱️ {task.estimatedTime}min</span>}
                  </div>
                </div>

                <div className="task-actions">
                  <div className="xp-badge">+{task.actualXPEarned || task.baseXP}</div>
                  <button
                    className="btn-icon delete"
                    onClick={() => handleDeleteTask(task._id)}
                    title="Delete task"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
