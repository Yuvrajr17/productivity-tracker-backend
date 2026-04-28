const User = require('../models/User');
const Badge = require('../models/Badge');

// Calculate XP based on task difficulty and priority
const calculateTaskXP = (task) => {
  let baseXP = task.baseXP || 10;
  let multiplier = 1.0;

  // Priority multiplier
  if (task.priority === 'high') multiplier = 1.5;
  else if (task.priority === 'medium') multiplier = 1.2;

  // Time-based bonus
  if (task.estimatedTime && task.actualTime) {
    if (task.actualTime < task.estimatedTime * 0.8) {
      multiplier += 0.25; // Bonus for finishing early
    }
  }

  return Math.round(baseXP * multiplier);
};

// Calculate level based on total XP
const calculateLevel = (totalXP) => {
  // XP required per level: 100 * level
  let level = 1;
  let xpRequired = 0;

  while (xpRequired + 100 * level <= totalXP) {
    xpRequired += 100 * level;
    level++;
  }

  return level;
};

// Check and award badges
const checkAndAwardBadges = async (userId) => {
  const user = await User.findById(userId);
  const existingBadges = user.badges.map((b) => b.name);

  const badges = [];

  // First Step Badge
  if (user.totalTasksCompleted === 1 && !existingBadges.includes('First Step')) {
    badges.push({
      name: 'First Step',
      description: 'Complete your first task',
      earnedAt: new Date(),
      icon: '👣',
    });
  }

  // Task Master Badge
  if (user.totalTasksCompleted === 10 && !existingBadges.includes('Task Master')) {
    badges.push({
      name: 'Task Master',
      description: 'Complete 10 tasks',
      earnedAt: new Date(),
      icon: '🎯',
    });
  }

  // Week Warrior Badge
  if (user.currentStreak >= 7 && !existingBadges.includes('Week Warrior')) {
    badges.push({
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      earnedAt: new Date(),
      icon: '⚔️',
    });
  }

  // Streak Keeper Badge
  if (user.longestStreak >= 30 && !existingBadges.includes('Streak Keeper')) {
    badges.push({
      name: 'Streak Keeper',
      description: 'Achieve a 30-day streak',
      earnedAt: new Date(),
      icon: '🔥',
    });
  }

  // XP Collector Badge
  if (user.totalXP >= 1000 && !existingBadges.includes('XP Collector')) {
    badges.push({
      name: 'XP Collector',
      description: 'Earn 1000 XP',
      earnedAt: new Date(),
      icon: '⭐',
    });
  }

  // Century Club Badge
  if (user.totalTasksCompleted === 100 && !existingBadges.includes('Century Club')) {
    badges.push({
      name: 'Century Club',
      description: 'Complete 100 tasks',
      earnedAt: new Date(),
      icon: '💯',
    });
  }

  // Level Up Badge
  if (user.level >= 10 && !existingBadges.includes('Level Up')) {
    badges.push({
      name: 'Level Up',
      description: 'Reach level 10',
      earnedAt: new Date(),
      icon: '📈',
    });
  }

  // Add new badges to user
  if (badges.length > 0) {
    user.badges.push(...badges);
    await user.save();

    // Save badges to Badge collection
    for (const badge of badges) {
      await Badge.create({
        userId,
        badgeName: badge.name,
        description: badge.description,
        earnedAt: badge.earnedAt,
        icon: badge.icon,
      });
    }
  }

  return badges;
};

// Update streak
const updateStreak = async (userId) => {
  const user = await User.findById(userId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (user.lastCompletedDate) {
    const lastCompleted = new Date(user.lastCompletedDate);
    lastCompleted.setHours(0, 0, 0, 0);

    const diffTime = today - lastCompleted;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day
      user.currentStreak += 1;
      if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak;
      }
    } else if (diffDays > 1) {
      // Streak broken
      user.currentStreak = 1;
    }
    // If diffDays === 0, same day, don't change streak
  } else {
    // First task
    user.currentStreak = 1;
  }

  user.lastCompletedDate = new Date();
  await user.save();

  return user.currentStreak;
};

module.exports = {
  calculateTaskXP,
  calculateLevel,
  checkAndAwardBadges,
  updateStreak,
};
