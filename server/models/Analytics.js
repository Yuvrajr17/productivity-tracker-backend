const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    tasksCompleted: {
      type: Number,
      default: 0,
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
    totalTimeSpent: {
      type: Number, // in minutes
      default: 0,
    },
    categoryBreakdown: {
      work: { type: Number, default: 0 },
      health: { type: Number, default: 0 },
      learning: { type: Number, default: 0 },
      personal: { type: Number, default: 0 },
      fitness: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    avgCompletionTime: Number, // in minutes
    productivityScore: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Analytics', analyticsSchema);
