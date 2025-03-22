import Flashcard from '../models/Flashcard.js';
import { generateFlashcards } from '../services/nlpService.js';

export const createFlashcardSet = async (req, res) => {
  try {
    const { text } = req.body;
    const flashcards = await generateFlashcards(text);
    const newFlashcardSet = new Flashcard({ flashcards });
    await newFlashcardSet.save();
    res.json(newFlashcardSet);
  } catch (error) {
    console.error('Error creating flashcard set:', error);
    res.status(500).json({ message: 'Error creating flashcard set' });
  }
}; 