import { generateFlashcardsFromDocument } from '../services/nlpService.js';
import Flashcard from '../models/Flashcard.js';

export const createFlashcardSet = async (req, res) => {
  try {
    const { text, query, options } = req.body;
    
    // Generate flashcards with metadata
    const result = await generateFlashcardsFromDocument(text, query, false, options);
    
    // Create new flashcard set with generated data
    const newFlashcardSet = new Flashcard({
      title: result.metadata.title,
      description: result.metadata.description,
      flashcards: result.flashcards,
      tags: result.metadata.tags,
      aiGenerated: true
    });
    
    await newFlashcardSet.save();
    res.json(newFlashcardSet);
  } catch (error) {
    console.error('Error creating flashcard set:', error);
    res.status(500).json({ message: 'Error creating flashcard set' });
  }
};