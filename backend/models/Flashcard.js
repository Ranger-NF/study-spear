import mongoose from 'mongoose';

// Individual flashcard schema
const CardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  timeStats: [{
    attemptDate: {
      type: Date,
      default: Date.now
    },
    responseTimeMs: {
      type: Number,
      default: 0
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  averageResponseTime: {
    type: Number,
    default: 0
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  correctAttempts: {
    type: Number,
    default: 0
  }
});

// Flashcard set schema
const FlashcardSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Untitled Flashcard Set'
  },
  description: {
    type: String,
    default: ''
  },
  flashcards: [CardSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Can make this required if you have user authentication
  },
  aiGenerated: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String
  }],
  studyStats: {
    lastStudied: Date,
    totalStudySessions: {
      type: Number,
      default: 0
    },
    averageSessionDuration: {
      type: Number,
      default: 0 // in seconds
    }
  }
});

// Methods to update card statistics
CardSchema.methods.updateStats = function(responseTimeMs, isCorrect) {
  this.timeStats.push({
    attemptDate: new Date(),
    responseTimeMs,
    isCorrect
  });
  
  this.totalAttempts += 1;
  if (isCorrect) {
    this.correctAttempts += 1;
  }
  
  // Calculate new average response time
  const totalTime = this.timeStats.reduce((sum, stat) => sum + stat.responseTimeMs, 0);
  this.averageResponseTime = totalTime / this.timeStats.length;
  
  return this.save();
};

// Pre-save middleware to automatically calculate some stats
FlashcardSchema.pre('save', function(next) {
  if (this.isModified('flashcards')) {
    // You could implement additional logic here like automatically 
    // adjusting difficulty based on response times and correctness
  }
  next();
});

export default mongoose.model('Flashcard', FlashcardSchema);