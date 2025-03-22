import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const api = {
  // Flashcard Sets
  flashcards: {
    // Get all flashcard sets
    getAll: async (includePublic = true) => {
      try {
        const response = await apiClient.get(`/flashcards?includePublic=${includePublic}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching flashcards:', error);
        throw error;
      }
    },
    
    // Get a specific flashcard set
    getById: async (id) => {
      try {
        const response = await apiClient.get(`/flashcards/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching flashcard set ${id}:`, error);
        throw error;
      }
    },
    
    // Create flashcard set from text content
    createFromText: async (content, query = '', options = {}) => {
      try {
        const response = await apiClient.post('/flashcards', {
          content,
          query,
          options
        });
        return response.data;
      } catch (error) {
        console.error('Error creating flashcards from text:', error);
        throw error;
      }
    },
    
    // Create flashcard set from file upload
    createFromFile: async (file, query = '', options = {}) => {
      try {
        const formData = new FormData();
        formData.append('document', file);
        formData.append('query', query);
        formData.append('options', JSON.stringify(options));
        
        const response = await apiClient.post('/flashcards', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error creating flashcards from file:', error);
        throw error;
      }
    },
    
    // Update flashcard set
    update: async (id, data) => {
      try {
        const response = await apiClient.put(`/flashcards/${id}`, data);
        return response.data;
      } catch (error) {
        console.error(`Error updating flashcard set ${id}:`, error);
        throw error;
      }
    },
    
    // Delete flashcard set
    delete: async (id) => {
      try {
        const response = await apiClient.delete(`/flashcards/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error deleting flashcard set ${id}:`, error);
        throw error;
      }
    },
    
    // Update card statistics
    updateCardStats: async (setId, cardId, responseTimeMs, isCorrect) => {
      try {
        const response = await apiClient.post(`/flashcards/${setId}/cards/${cardId}/stats`, {
          responseTimeMs,
          isCorrect
        });
        return response.data;
      } catch (error) {
        console.error('Error updating card stats:', error);
        throw error;
      }
    }
  },
  
  // Authentication (assuming you'll implement this)
  auth: {
    login: async (email, password) => {
      try {
        const response = await apiClient.post('/auth/login', { email, password });
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        return response.data;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    
    logout: () => {
      localStorage.removeItem('token');
    }
  }
};

export default api;