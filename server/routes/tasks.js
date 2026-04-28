const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { calculateTaskXP, calculateLevel, checkAndAwardBadges, updateStreak } = require('../utils/gamification');

const router = express.Router();

// Create a new task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, priority, dueDate, baseXP, estimatedTime, tags } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = new Task({
      userId: req.user.id,
      title,
      description,
      category,
      priority,
      dueDate,
      baseXP: baseXP || 10,
      estimatedTime,
      tags: tags || [],
    });

    await task.save();
    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all tasks for user
router.get('/', auth, async (req, res) => {
  try {
    const { completed, category, priority } = req.query;

    let filter = { userId: req.user.id };

    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }

    if (category) {
      filter.category = category;
    }

    if (priority) {
      filter.priority = priority;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single task
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this task' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const { title, description, category, priority, dueDate, completed, actualTime, tags } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (category) task.category = category;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (actualTime !== undefined) task.actualTime = actualTime;
    if (tags) task.tags = tags;

    // Handle task completion
    if (completed !== undefined && !task.completed && completed === true) {
      task.completed = true;
      task.completedAt = new Date();

      // Calculate XP
      const xpEarned = calculateTaskXP(task);
      task.actualXPEarned = xpEarned;

      // Update user stats
      const user = await User.findById(req.user.id);
      user.totalXP += xpEarned;
      user.totalTasksCompleted += 1;

      // Update level
      user.level = calculateLevel(user.totalXP);

      // Update streak
      await updateStreak(req.user.id);

      // Check for badges
      await checkAndAwardBadges(req.user.id);

      await user.save();
    } else if (completed !== undefined && task.completed && completed === false) {
      // Un-complete task
      task.completed = false;
      task.completedAt = null;

      const user = await User.findById(req.user.id);
      user.totalXP -= task.actualXPEarned;
      user.totalTasksCompleted = Math.max(0, user.totalTasksCompleted - 1);
      user.level = calculateLevel(user.totalXP);

      await user.save();
    } else {
      task.completed = completed;
    }

    await task.save();

    res.status(200).json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get task statistics
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });

    const stats = {
      total: tasks.length,
      completed: tasks.filter((t) => t.completed).length,
      pending: tasks.filter((t) => !t.completed).length,
      byCategory: {},
      byPriority: {},
      totalXPEarned: tasks.reduce((sum, t) => sum + (t.actualXPEarned || 0), 0),
    };

    // Category breakdown
    tasks.forEach((task) => {
      if (!stats.byCategory[task.category]) {
        stats.byCategory[task.category] = 0;
      }
      stats.byCategory[task.category]++;
    });

    // Priority breakdown
    tasks.forEach((task) => {
      if (!stats.byPriority[task.priority]) {
        stats.byPriority[task.priority] = 0;
      }
      stats.byPriority[task.priority]++;
    });

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
