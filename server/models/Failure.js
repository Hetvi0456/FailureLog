const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  result: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const failureSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  errorMessage: {
    type: String,
    default: ''
  },
  project: {
    type: String,
    default: ''
  },
  technology: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: ''
  },
  environment: {
    type: String,
    default: ''
  },
  rootCause: {
    type: String,
    default: ''
  },
  solution: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved'],
    default: 'open'
  },
  attempts: [attemptSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Failure', failureSchema);
