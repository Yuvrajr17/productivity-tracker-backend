const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['work', 'health', 'learning', 'personal', 'fitness', 'other'],
      default: 'personal',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    // Gamification
    baseXP: {
      type: Number,
      default: 10,
    },
    actualXPEarned: {
      type: Number,
      default: 0,
    },
    difficultyMultiplier: {
      type: Number,
      default: 1.0, // 1.0 for normal, 1.5 for high priority, etc.
    },
    tags: [String],
    notes: String,
    estimatedTime: Number, // in minutes
    actualTime: Number, // in minutes
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
