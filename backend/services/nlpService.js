import natural from 'natural';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger.js';

// Initialize NLP tools
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

/**
 * Generates flashcards from text content with advanced NLP features
 * @param {string} input - Text content or file path
 * @param {string} userQuery - Optional query to filter content
 * @param {boolean} isFilePath - Whether input is a file path
 * @param {Object} options - Additional generation options
 * @returns {Object} Object containing flashcards and metadata
 */
export async function generateFlashcardsFromDocument(input, userQuery = '', isFilePath = false, options = {}) {
  try {
    // Input validation
    if (!input) {
      throw new Error('No input provided to generate flashcards');
    }

    // Default options
    const config = {
      maxCards: options.maxCards || 20,
      includeDifficulty: options.includeDifficulty !== false,
      includeMetadata: options.includeMetadata !== false,
      generateQuestionTypes: options.generateQuestionTypes || ['concept', 'definition', 'application']
    };
    
    // Get text content
    let fileContent;
    if (isFilePath) {
      try {
        fileContent = fs.readFileSync(input, 'utf8');
      } catch (error) {
        logger.error('Error reading file:', error);
        throw new Error('Could not read input file');
      }
    } else {
      fileContent = input.toString(); // Convert input to string to ensure it's text
    }

    // Validate content
    if (!fileContent || typeof fileContent !== 'string') {
      throw new Error('Invalid content provided');
    }

    // Clean the content before processing
    fileContent = fileContent.trim();
    if (fileContent.length === 0) {
      throw new Error('Empty content provided');
    }

    // Process text into sentences
    const sentences = fileContent.split(/[.!?]+/).filter(s => s.trim());
    
    // Filter by user query if provided
    let relevantSentences = sentences;
    if (userQuery && userQuery.trim()) {
      relevantSentences = sentences.filter(sentence =>
        sentence.toLowerCase().includes(userQuery.toLowerCase())
      );
    }
    
    // Use TF-IDF to identify important terms
    const tfidf = new TfIdf();
    relevantSentences.forEach(sentence => {
      tfidf.addDocument(sentence);
    });
    
    // Generate flashcards with varying question types and difficulty levels
    const flashcards = [];
    
    relevantSentences.forEach((sentence, index) => {
      if (flashcards.length >= config.maxCards) return;
      
      // Extract important terms from this sentence
      const terms = [];
      tfidf.listTerms(index).slice(0, 5).forEach(item => {
        terms.push(item.term);
      });
      
      // Generate different question types
      if (config.generateQuestionTypes.includes('concept')) {
        flashcards.push({
          question: `What is the main idea of: "${sentence.trim()}"?`,
          answer: sentence.trim(),
          difficulty: estimateDifficulty(sentence),
          type: 'concept',
          terms: terms,
          timeStats: [],
          averageResponseTime: 0,
          totalAttempts: 0,
          correctAttempts: 0
        });
      }
      
      if (terms.length > 0 && config.generateQuestionTypes.includes('definition')) {
        const mainTerm = terms[0];
        if (sentence.toLowerCase().includes(mainTerm.toLowerCase())) {
          flashcards.push({
            question: `Define or explain the term: "${mainTerm}"`,
            answer: sentence.trim(),
            difficulty: estimateDifficulty(sentence),
            type: 'definition',
            terms: [mainTerm],
            timeStats: [],
            averageResponseTime: 0,
            totalAttempts: 0,
            correctAttempts: 0
          });
        }
      }
      
      if (config.generateQuestionTypes.includes('application') && sentence.length > 50) {
        flashcards.push({
          question: `Apply the concept from this statement to a new situation: "${sentence.trim()}"`,
          answer: `Based on "${sentence.trim()}", one could apply this by...`,
          difficulty: 'hard', // Application questions are typically harder
          type: 'application',
          terms: terms,
          timeStats: [],
          averageResponseTime: 0,
          totalAttempts: 0,
          correctAttempts: 0
        });
      }
    });
    
    // Add metadata if requested
    if (config.includeMetadata) {
      const metadata = {
        title: generateTitle(fileContent, userQuery),
        description: generateDescription(fileContent),
        tags: generateTags(fileContent),
        aiGenerated: true,
        studyStats: {
          lastStudied: null,
          totalStudySessions: 0,
          averageSessionDuration: 0
        }
      };
      
      return { flashcards, metadata };
    }
    
    return { flashcards };
  } catch (error) {
    logger.error('Error generating flashcards:', error);
    throw error;
  }
}

/**
 * Estimates difficulty level based on sentence complexity
 * @param {string} sentence - The sentence to analyze
 * @returns {string} Difficulty level: 'easy', 'medium', or 'hard'
 */
function estimateDifficulty(sentence) {
  // Simple heuristic based on sentence length and complexity
  const words = tokenizer.tokenize(sentence);
  const wordCount = words.length;
  const avgWordLength = words.join('').length / wordCount;
  
  if (wordCount > 20 || avgWordLength > 7) {
    return 'hard';
  } else if (wordCount > 10 || avgWordLength > 5) {
    return 'medium';
  } else {
    return 'easy';
  }
}

/**
 * Generate a title based on content and query
 * @param {string} content - Text content
 * @param {string} query - User query
 * @returns {string} Generated title
 */
function generateTitle(content, query) {
  if (query && query.trim()) {
    return `Flashcards on ${query.charAt(0).toUpperCase() + query.slice(1)}`;
  }
  
  // Extract potential title from first sentence
  const firstSentence = content.split('.')[0].trim();
  if (firstSentence.length < 50) {
    return firstSentence;
  }
  
  return 'Generated Flashcard Set';
}

/**
 * Generate a brief description of the content
 * @param {string} content - Text content
 * @returns {string} Generated description
 */
function generateDescription(content) {
  // Use first ~100 characters as description
  if (content.length > 150) {
    return content.substring(0, 147) + '...';
  }
  return content;
}

/**
 * Generate tags based on content
 * @param {string} content - Text content
 * @returns {Array} Array of tags
 */
function generateTags(content) {
  const tfidf = new TfIdf();
  tfidf.addDocument(content);
  
  // Extract top terms as tags
  const tags = [];
  tfidf.listTerms(0).slice(0, 5).forEach(item => {
    if (item.term.length > 3) {
      tags.push(item.term);
    }
  });
  
  return tags;
}

/**
 * Enhanced generation with advanced NLP (can be implemented with additional libraries)
 * @param {string} content - Text content
 * @returns {Object} Enhanced flashcard set
 */
export async function enhancedFlashcardGeneration(content) {
  // This could be expanded with more advanced NLP techniques
  // like using transformers for better question generation
  logger.info('Using enhanced NLP for flashcard generation');
  return generateFlashcardsFromDocument(content);
}