Copy
const Flashcard = require('../models/Flashcard');
const nlpService = require('../services/nlpService');

// Create a new flashcard set
const createFlashcardSet = async (req, res) => {
  const { text } = req.body;
  const flashcards = await nlpService.generateFlashcards(text);
  const newFlashcardSet = new Flashcard({ flashcards });
  await newFlashcardSet.save();
  res.json(newFlashcardSet);
};

// Other CRUD operations...

module.exports = { createFlashcardSet };