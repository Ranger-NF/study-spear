import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar';

// Create API service
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Flashcard API endpoints
const flashcardAPI = {
  getAll: () => api.get('/flashcards'),
  getById: (id) => api.get(`/flashcards/${id}`),
  create: (data) => api.post('/flashcards', data),
  update: (id, data) => api.put(`/flashcards/${id}`, data),
  delete: (id) => api.delete(`/flashcards/${id}`),
};

// Set auth token helper
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

const LearnView = ({ flashcards, selectedDifficulty, selectedFileId, setActiveView }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const filteredCards = flashcards.filter(card => 
    card.difficulty === selectedDifficulty && 
    (!selectedFileId || card.fileId === selectedFileId)
  );

  if (filteredCards.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-xl mb-4">No flashcards found with this difficulty level.</p>
        <button 
          onClick={() => setActiveView('home')}
          className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const currentCard = filteredCards[currentCardIndex];

  return (
    <div className="h-full flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Learning: <span className="capitalize">{selectedDifficulty}</span> Cards
          </h2>
          <span className="text-gray-500">
            {currentCardIndex + 1} of {filteredCards.length}
          </span>
        </div>
        
        <div 
          className="border border-gray-200 rounded-lg p-8 min-h-64 mb-6 flex flex-col items-center justify-center cursor-pointer"
          onClick={() => setShowAnswer(!showAnswer)}
        >
          <div className="text-center">
            <p className="text-xl font-medium mb-4">{currentCard.question}</p>
            
            {showAnswer && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-lg">{currentCard.answer}</p>
              </div>
            )}
            
            {!showAnswer && (
              <p className="text-gray-500 mt-4">Click to reveal answer</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-between">
          <button 
            onClick={() => {
              if (currentCardIndex > 0) {
                setCurrentCardIndex(currentCardIndex - 1);
                setShowAnswer(false);
              }
            }}
            disabled={currentCardIndex === 0}
            className={`py-2 px-6 rounded-md ${
              currentCardIndex === 0 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          
          <button 
            onClick={() => setActiveView('home')}
            className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300"
          >
            Exit
          </button>
          
          <button 
            onClick={() => {
              if (currentCardIndex < filteredCards.length - 1) {
                setCurrentCardIndex(currentCardIndex + 1);
                setShowAnswer(false);
              } else {
                // Finished all cards
                alert('You completed this set!');
                setActiveView('home');
              }
            }}
            className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600"
          >
            {currentCardIndex < filteredCards.length - 1 ? 'Next' : 'Finish'}
          </button>
        </div>
      </div>
    </div>
  );
};

const FlashcardLearningPlatform = () => {
  const [files, setFiles] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('library'); // 'library', 'create', 'learn'
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [newCard, setNewCard] = useState({ question: '', answer: '', difficulty: 'medium', fileId: null });

  const difficultyLevels = [
    { id: 'easy', name: 'Easy Topics', icon: 'battery-low' },
    { id: 'medium', name: 'Medium Topics', icon: 'battery-medium' },
    { id: 'hard', name: 'Hard Topics', icon: 'battery-high' }
  ];

  // Load token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
    fetchFiles();
    fetchFlashcards();
  }, []);

  // Fetch files from backend
  const fetchFiles = async () => {
    try {
      // In a real app, you'd have a file API endpoint
      // For now, we'll simulate it with static data
      const mockFiles = [
        { id: 1, name: 'Biology Notes' },
        { id: 2, name: 'History Chapter 5' },
        { id: 3, name: 'Spanish Vocabulary' }
      ];
      setFiles(mockFiles);
    } catch (err) {
      setError('Failed to fetch files');
      console.error(err);
    }
  };

  // Fetch flashcards from backend
  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const response = await flashcardAPI.getAll();
      setFlashcards(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch flashcards');
      setLoading(false);
      console.error(err);
    }
  };

  const addNewFile = () => {
    const fileName = prompt('Enter file name:');
    if (fileName) {
      const newId = files.length > 0 ? Math.max(...files.map(f => f.id)) + 1 : 1;
      const newFile = { id: newId, name: fileName };
      setFiles([...files, newFile]);
      
      // In a real app, you would save this to your backend
      // await fileAPI.create(newFile);
    }
  };

  const handleCardCreate = async (e) => {
    e.preventDefault();
    if (!newCard.question || !newCard.answer || !selectedFileId) {
      alert('Please fill in all fields and select a file');
      return;
    }

    try {
      const cardData = {
        ...newCard,
        fileId: selectedFileId
      };
      
      await flashcardAPI.create(cardData);
      setNewCard({ question: '', answer: '', difficulty: 'medium', fileId: null });
      fetchFlashcards(); // Refresh cards
      setActiveView('library');
    } catch (err) {
      setError('Failed to create flashcard');
      console.error(err);
    }
  };

  const deleteFlashcard = async (id) => {
    try {
      await flashcardAPI.delete(id);
      fetchFlashcards();
    } catch (err) {
      setError('Failed to delete flashcard');
      console.error(err);
    }
  };

  const startLearning = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setActiveView('learn');
  };

  const renderLibraryView = () => (
    <div className="flex w-full h-full">
      {/* Left Panel - Sources */}
      <div className="w-1/3 border-r border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-6">Sources</h2>
        <div className="space-y-4">
          {files.map(file => (
            <div 
              key={file.id} 
              className={`flex items-center p-2 rounded-md cursor-pointer ${selectedFileId === file.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => setSelectedFileId(file.id)}
            >
              <div className="w-6 h-6 rounded-full border border-gray-400 mr-4 flex items-center justify-center">
                {selectedFileId === file.id && <div className="w-4 h-4 rounded-full bg-blue-500"></div>}
              </div>
              <span>{file.name}</span>
            </div>
          ))}
          <div className="flex items-center cursor-pointer p-2 rounded-md hover:bg-gray-100" onClick={addNewFile}>
            <div className="w-6 h-6 rounded-full border border-gray-400 mr-4 flex items-center justify-center">
              <span className="text-gray-500">+</span>
            </div>
            <span>Add File</span>
          </div>
        </div>
        
        <div className="mt-8">
          <button 
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            onClick={() => setActiveView('create')}
          >
            Create New Flashcard
          </button>
        </div>
      </div>

      {/* Right Panel - Flashcards */}
      <div className="w-2/3 p-6">
        <h2 className="text-2xl font-bold mb-6">Flashcards</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading flashcards...</p>
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : flashcards.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No flashcards yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {flashcards
              .filter(card => !selectedFileId || card.fileId === selectedFileId)
              .map(card => (
                <div key={card._id || card.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md">
                  <div className="flex justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      card.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                      card.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {card.difficulty}
                    </span>
                    <button 
                      onClick={() => deleteFlashcard(card._id || card.id)} 
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                  <h3 className="font-bold mb-2">{card.question}</h3>
                  <p className="text-gray-700">{card.answer}</p>
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderCreateView = () => (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Create New Flashcard</h2>
      
      <form onSubmit={handleCardCreate}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select File:</label>
          <select 
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={selectedFileId || ''}
            onChange={(e) => setSelectedFileId(e.target.value ? Number(e.target.value) : null)}
            required
          >
            <option value="">Select a file</option>
            {files.map(file => (
              <option key={file.id} value={file.id}>{file.name}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Question:</label>
          <textarea 
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={newCard.question}
            onChange={(e) => setNewCard({...newCard, question: e.target.value})}
            rows="3"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Answer:</label>
          <textarea 
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={newCard.answer}
            onChange={(e) => setNewCard({...newCard, answer: e.target.value})}
            rows="3"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Difficulty:</label>
          <div className="flex gap-4">
            {['easy', 'medium', 'hard'].map(level => (
              <label key={level} className="flex items-center">
                <input 
                  type="radio" 
                  name="difficulty" 
                  value={level}
                  checked={newCard.difficulty === level}
                  onChange={() => setNewCard({...newCard, difficulty: level})}
                  className="mr-2"
                />
                <span className="capitalize">{level}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition-colors"
          >
            Save Card
          </button>
          <button 
            type="button"
            onClick={() => setActiveView('library')}
            className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderDifficultySelection = () => (
    <div className="w-full p-6 flex flex-col items-center justify-center">
      <div className="grid grid-cols-3 gap-6 mb-12 w-full max-w-5xl">
        {difficultyLevels.map(level => (
          <div 
            key={level.id} 
            className="border border-gray-200 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => startLearning(level.id)}
          >
            <div className="w-16 h-16 mb-4 relative">
              {/* Battery Icon with Lightning */}
              <div className="w-12 h-16 bg-white border-2 border-gray-800 mx-auto rounded-md relative">
                <div className="w-6 h-3 bg-gray-800 absolute -top-3 left-3 rounded-t-md"></div>
                <div className="absolute inset-2">
                  {level.icon === 'battery-low' && <div className="h-1/3 bg-gray-800 absolute bottom-0 w-full"></div>}
                  {level.icon === 'battery-medium' && <div className="h-2/3 bg-gray-800 absolute bottom-0 w-full"></div>}
                  {level.icon === 'battery-high' && <div className="h-full bg-gray-800 absolute bottom-0 w-full"></div>}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold">
                    ⚡
                  </div>
                </div>
              </div>
              {/* Play Button Overlay */}
              <div className="absolute top-1/2 left-full -translate-y-1/2 -translate-x-1/2 w-10 h-10">
                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-16 border-l-black border-b-8 border-b-transparent filter drop-shadow-md"></div>
              </div>
            </div>
            <h3 className="text-lg font-medium">{level.name}</h3>
          </div>
        ))}
      </div>
      <p className="text-xl font-medium text-center">
        Choose Type of Difficulty and Start Learning
      </p>
    </div>
  );

  const renderLearnView = () => (
    <LearnView 
      flashcards={flashcards}
      selectedDifficulty={selectedDifficulty}
      selectedFileId={selectedFileId}
      setActiveView={setActiveView}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 overflow-hidden">
          <div className="border-b border-gray-200 p-4 bg-white shadow-sm">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Flashcard Learning Platform</h1>
              <div className="space-x-4">
                <button 
                  onClick={() => setActiveView('home')}
                  className={`px-4 py-2 rounded-md ${activeView === 'home' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                >
                  Home
                </button>
                <button 
                  onClick={() => setActiveView('library')}
                  className={`px-4 py-2 rounded-md ${activeView === 'library' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                >
                  Library
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4 h-full">
            {activeView === 'home' && renderDifficultySelection()}
            {activeView === 'library' && renderLibraryView()}
            {activeView === 'create' && renderCreateView()}
            {activeView === 'learn' && renderLearnView()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardLearningPlatform;