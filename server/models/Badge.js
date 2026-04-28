const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    badgeName: {
      type: String,
      required: true,
      enum: [
        'First Step',
        'Task Master',
        'Week Warrior',
        'Streak Keeper',
        'XP Collector',
        'Perfect Day',
        'Century Club',
        'Level Up',
        'Consistency King',
        'Challenge Accepted',
      ],
    },
    description: String,
    earnedAt: {
      type: Date,
      default: Date.now,
    },
    icon: String,
    criteria: String, // Description of how badge was earned
  },
  { timestamps: true }
);

module.exports = mongoose.model('Badge', badgeSchema);
