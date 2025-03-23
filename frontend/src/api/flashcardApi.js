import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

/**
 * API client for flashcard application
 * Provides methods to interact with the backend services
 */
class FlashcardApi {
  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to all requests if available
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle common API errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // Handle specific error cases
          switch (error.response.status) {
            case 401:
              // Unauthorized - clear local storage and redirect to login
              localStorage.removeItem('auth_token');
              window.location.href = '/login';
              break;
            case 403:
              // Forbidden
              console.error('Access denied:', error.response.data.message);
              break;
            case 404:
              // Not found
              console.error('Resource not found:', error.response.data.message);
              break;
            default:
              console.error('API Error:', error.response.data.message || 'Unknown error');
          }
        } else if (error.request) {
          // Network error
          console.error('Network Error: Unable to reach the server');
        } else {
          console.error('Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  
  // Get all flashcard sets with optional public inclusion
  async getFlashcardSets(includePublic = true) {
    const response = await this.client.get(`/flashcards?includePublic=${includePublic}`);
    return response.data;
  }

  // Get a specific flashcard set by ID
  async getFlashcardSet(id) {
    const response = await this.client.get(`/flashcards/${id}`);
    return response.data;
  }

  // Create flashcard set from text content
  async createFlashcardsFromText(content, options = {}) {
    const requestData = {
      content,
      query: options.query || '',
      options: {
        maxCards: options.maxCards || 20,
        includeDifficulty: options.includeDifficulty !== false,
        includeMetadata: options.includeMetadata !== false,
        generateQuestionTypes: options.questionTypes || ['concept', 'definition', 'application'],
        deleteAfterProcessing: options.deleteAfterProcessing || false
      }
    };

    console.log('Creating flashcards with NLP:', requestData);
    const response = await this.client.post('/flashcards', requestData);
    return response.data;
  }

  // Create flashcard set from file upload
  async createFlashcardsFromFile(file, options = {}) {
    const formData = new FormData();
    formData.append('document', file);
    
    // Add NLP options
    const nlpOptions = {
      maxCards: options.maxCards || 20,
      includeDifficulty: options.includeDifficulty !== false,
      includeMetadata: options.includeMetadata !== false,
      generateQuestionTypes: options.questionTypes || ['concept', 'definition', 'application'],
      deleteAfterProcessing: options.deleteAfterProcessing || false
    };

    formData.append('query', options.query || '');
    formData.append('options', JSON.stringify(nlpOptions));

    console.log('Creating flashcards from file with NLP:', {
      fileName: file.name,
      options: nlpOptions
    });

    const response = await this.client.post('/flashcards', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  // Update existing flashcard set
  async updateFlashcardSet(id, data) {
    const response = await this.client.put(`/flashcards/${id}`, data);
    return response.data;
  }

  // Delete flashcard set
  async deleteFlashcardSet(id) {
    const response = await this.client.delete(`/flashcards/${id}`);
    return response.data;
  }

  /**
   * Flashcard Study Methods
   */
  
  // Update card statistics after study
  async updateCardStats(setId, cardId, responseTimeMs, isCorrect) {
    const response = await this.client.post(`/flashcards/${setId}/cards/${cardId}/stats`, {
      responseTimeMs,
      isCorrect
    });
    return response.data;
  }

  // Get study statistics for a flashcard set
  async getStudyStats(setId) {
    const response = await this.client.get(`/flashcards/${setId}/stats`);
    return response.data;
  }

  // New method for enhanced NLP generation
  async generateEnhancedFlashcards(content, options = {}) {
    const requestData = {
      content,
      query: options.query || '',
      options: {
        ...options,
        useEnhancedNLP: true, // Signal to use enhanced NLP processing
        maxCards: options.maxCards || 20,
        questionTypes: options.questionTypes || ['concept', 'definition', 'application'],
        difficulty: options.difficulty || 'auto',
        includeMetadata: true,
        generateTags: true
      }
    };

    console.log('Generating enhanced flashcards:', requestData);
    const response = await this.client.post('/flashcards/enhanced', requestData);
    return response.data;
  }

  // New method to analyze content difficulty
  async analyzeContentDifficulty(content) {
    const response = await this.client.post('/flashcards/analyze', { content });
    return response.data;
  }

  // New method to get suggested study topics
  async getSuggestedTopics(content) {
    const response = await this.client.post('/flashcards/suggest-topics', { content });
    return response.data;
  }
}

export default new FlashcardApi();