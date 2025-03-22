import natural from 'natural';
import { pipeline } from '@xenova/transformers';

const tokenizer = new natural.WordTokenizer();

export async function generateFlashcards(text) {
  try {
    const words = tokenizer.tokenize(text);
    // Basic implementation - create a flashcard for each sentence
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    
    return sentences.map(sentence => ({
      question: sentence.trim() + '?',
      answer: sentence.trim()
    }));
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw error;
  }
} 