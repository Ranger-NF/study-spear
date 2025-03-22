import mongoose from 'mongoose';

const FlashcardSchema = new mongoose.Schema({
  flashcards: [{
    question: String,
    answer: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Flashcard', FlashcardSchema); 