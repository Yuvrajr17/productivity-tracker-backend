const express = require('express');
const User = require('../models/User');
const Badge = require('../models/Badge');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('badges');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, profilePicture } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) {
      const existingUser = await User.findOne({ username, _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      user.username = username;
    }

    if (profilePicture) {
      user.profilePicture = profilePicture;
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user badges
router.get('/badges', auth, async (req, res) => {
  try {
    const badges = await Badge.find({ userId: req.user.id }).sort({ earnedAt: -1 });

    res.status(200).json(badges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get gamification stats
router.get('/gamification/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const stats = {
      username: user.username,
      totalXP: user.totalXP,
      level: user.level,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      totalTasksCompleted: user.totalTasksCompleted,
      badgesCount: user.badges.length,
      badges: user.badges,
      xpToNextLevel: calculateXPToNextLevel(user.totalXP),
      leaderboardPosition: user.leaderboardPosition,
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topUsers = await User.find()
      .sort({ totalXP: -1 })
      .limit(parseInt(limit))
      .select('username totalXP level currentStreak totalTasksCompleted badges profilePicture');

    // Add rank
    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      ...user.toObject(),
    }));

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get leaderboard with pagination
router.get('/leaderboard/page', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const totalUsers = await User.countDocuments();
    const topUsers = await User.find()
      .sort({ totalXP: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('username totalXP level currentStreak totalTasksCompleted badges profilePicture');

    const leaderboard = topUsers.map((user, index) => ({
      rank: skip + index + 1,
      ...user.toObject(),
    }));

    res.status(200).json({
      leaderboard,
      totalPages: Math.ceil(totalUsers / parseInt(limit)),
      currentPage: parseInt(page),
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to calculate XP to next level
const calculateXPToNextLevel = (totalXP) => {
  let level = 1;
  let xpRequired = 0;

  while (xpRequired + 100 * level <= totalXP) {
    xpRequired += 100 * level;
    level++;
  }

  const xpNeededForCurrentLevel = 100 * level;
  const xpEarnedInCurrentLevel = totalXP - xpRequired;
  const xpToNextLevel = xpNeededForCurrentLevel - xpEarnedInCurrentLevel;

  return {
    currentLevel: level,
    xpToNextLevel: Math.max(0, xpToNextLevel),
    xpEarnedInCurrentLevel,
    xpNeededForCurrentLevel,
  };
};

module.exports = router;
