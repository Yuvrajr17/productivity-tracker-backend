const express = require('express');
const Task = require('../models/Task');
const Analytics = require('../models/Analytics');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get weekly analytics
router.get('/weekly', auth, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const tasks = await Task.find({
      userId: req.user.id,
      completed: true,
      completedAt: { $gte: sevenDaysAgo },
    });

    const dailyData = {};

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      dailyData[dateString] = {
        date: dateString,
        tasksCompleted: 0,
        xpEarned: 0,
      };
    }

    tasks.forEach((task) => {
      const dateString = task.completedAt.toISOString().split('T')[0];
      if (dailyData[dateString]) {
        dailyData[dateString].tasksCompleted += 1;
        dailyData[dateString].xpEarned += task.actualXPEarned || 0;
      }
    });

    const analyticsData = Object.values(dailyData);

    res.status(200).json(analyticsData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get monthly analytics
router.get('/monthly', auth, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const tasks = await Task.find({
      userId: req.user.id,
      completed: true,
      completedAt: { $gte: thirtyDaysAgo },
    });

    const user = await User.findById(req.user.id);

    const categoryBreakdown = {
      work: 0,
      health: 0,
      learning: 0,
      personal: 0,
      fitness: 0,
      other: 0,
    };

    let totalXPEarned = 0;
    let totalTasksCompleted = 0;
    let totalTimeSpent = 0;

    tasks.forEach((task) => {
      categoryBreakdown[task.category]++;
      totalXPEarned += task.actualXPEarned || 0;
      totalTasksCompleted += 1;
      totalTimeSpent += task.actualTime || 0;
    });

    const avgCompletionTime = totalTasksCompleted > 0 ? totalTimeSpent / totalTasksCompleted : 0;

    // Calculate productivity score (0-100)
    const productivityScore = Math.min(
      100,
      Math.floor((totalXPEarned / 1000) * 100 + (user.currentStreak / 100) * 50 + Math.min(totalTasksCompleted / 50, 1) * 50)
    );

    const analytics = {
      totalTasksCompleted,
      totalXPEarned,
      totalTimeSpent,
      avgCompletionTime: Math.round(avgCompletionTime),
      categoryBreakdown,
      productivityScore,
      streakInfo: {
        current: user.currentStreak,
        longest: user.longestStreak,
      },
      level: user.level,
    };

    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get category breakdown
router.get('/categories', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id, completed: true });

    const categoryStats = {
      work: { completed: 0, xp: 0 },
      health: { completed: 0, xp: 0 },
      learning: { completed: 0, xp: 0 },
      personal: { completed: 0, xp: 0 },
      fitness: { completed: 0, xp: 0 },
      other: { completed: 0, xp: 0 },
    };

    tasks.forEach((task) => {
      if (categoryStats[task.category]) {
        categoryStats[task.category].completed += 1;
        categoryStats[task.category].xp += task.actualXPEarned || 0;
      }
    });

    res.status(200).json(categoryStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
