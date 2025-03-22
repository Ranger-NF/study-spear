const mongoose = require('mongoose');

const FlashcardSchema = new mongoose.Schema({
  flashcards: [
    {
      question: String,
      answer: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Flashcard', FlashcardSchema);