

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
  async createFlashcardsFromText(content, query = '', options = {}) {
    const response = await this.client.post('/flashcards', {
      content,
      query,
      options
    });
    return response.data;
  }

  // Create flashcard set from file upload
  async createFlashcardsFromFile(file, query = '', options = {}) {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('query', query);
    formData.append('options', JSON.stringify(options));
    
    const response = await this.client.post('/flashcards', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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
}

export default new FlashcardApi();