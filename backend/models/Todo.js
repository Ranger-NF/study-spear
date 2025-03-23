import mongoose from 'mongoose';
import dayjs from 'dayjs';

const TodoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  task: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'missed'],
    default: 'pending'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  period: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'midnight']
  },
  priority: {
    type: Number,
    default: 2
  },
  estimatedDuration: {
    type: Number,
    required: true
  },
  completedAt: {
    type: Date
  },
  actualDuration: {
    type: Number
  },
  reassignmentReason: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Todo', TodoSchema); 