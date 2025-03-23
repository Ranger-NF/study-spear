import { generateFlashcardsFromDocument } from '../services/nlpService.js';
import Flashcard from '../models/Flashcard.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({ storage });

/**
 * Create a new flashcard set from text or file upload
 * @route POST /api/flashcards
 */
export const createFlashcardSet = async (req, res) => {
  try {
    const { content, query, options } = req.body;
    let filePath = null;
    
    // Handle file upload if present
    if (req.file) {
      filePath = req.file.path;
    }
    
    // Generate flashcards using NLP service
    const result = await generateFlashcardsFromDocument(
      filePath || content,
      query || '',
      !!filePath,
      options || {}
    );
    
    // Create new flashcard set in database
    const flashcardSet = new Flashcard({
      title: result.metadata?.title || 'Generated Flashcards',
      description: result.metadata?.description || '',
      flashcards: result.flashcards || result,
      userId: req.user?._id,
      aiGenerated: true,
      tags: result.metadata?.tags || []
    });
    
    await flashcardSet.save();
    
    // Clean up uploaded file if necessary
    if (filePath && options?.deleteAfterProcessing) {
      fs.unlinkSync(filePath);
    }
    
    res.status(201).json({
      success: true,
      message: 'Flashcard set created successfully',
      data: flashcardSet
    });
  } catch (error) {
    console.error('Error creating flashcard set:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create flashcard set',
      error: error.message
    });
  }
};

/**
 * Get all flashcard sets for a user
 * @route GET /api/flashcards
 */
export const getFlashcardSets = async (req, res) => {
  try {
    const query = { userId: req.user?._id };
    
    // Allow fetching public sets if specified
    if (req.query.includePublic === 'true') {
      query.$or = [{ userId: req.user?._id }, { isPublic: true }];
    }
    
    const flashcardSets = await Flashcard.find(query)
      .select('title description createdAt tags studyStats flashcards aiGenerated')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: flashcardSets.length,
      data: flashcardSets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch flashcard sets',
      error: error.message
    });
  }
};

/**
 * Get a single flashcard set by ID
 * @route GET /api/flashcards/:id
 */
export const getFlashcardSet = async (req, res) => {
  try {
    const flashcardSet = await Flashcard.findById(req.params.id);
    
    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard set not found'
      });
    }
    
    // Check ownership if not public
    if (flashcardSet.userId && 
        flashcardSet.userId.toString() !== req.user?._id.toString() && 
        !flashcardSet.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this flashcard set'
      });
    }
    
    res.status(200).json({
      success: true,
      data: flashcardSet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch flashcard set',
      error: error.message
    });
  }
};

/**
 * Update flashcard set
 * @route PUT /api/flashcards/:id
 */
export const updateFlashcardSet = async (req, res) => {
  try {
    const { title, description, flashcards, tags } = req.body;
    
    const flashcardSet = await Flashcard.findById(req.params.id);
    
    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard set not found'
      });
    }
    
    // Check ownership
    if (flashcardSet.userId && 
        flashcardSet.userId.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this flashcard set'
      });
    }
    
    // Update fields
    if (title) flashcardSet.title = title;
    if (description) flashcardSet.description = description;
    if (tags) flashcardSet.tags = tags;
    if (flashcards) flashcardSet.flashcards = flashcards;
    
    await flashcardSet.save();
    
    res.status(200).json({
      success: true,
      message: 'Flashcard set updated successfully',
      data: flashcardSet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update flashcard set',
      error: error.message
    });
  }
};

/**
 * Delete flashcard set
 * @route DELETE /api/flashcards/:id
 */
export const deleteFlashcardSet = async (req, res) => {
  try {
    const flashcardSet = await Flashcard.findById(req.params.id);
    
    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard set not found'
      });
    }
    
    // Check ownership
    if (flashcardSet.userId && 
        flashcardSet.userId.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this flashcard set'
      });
    }
    
    await flashcardSet.remove();
    
    res.status(200).json({
      success: true,
      message: 'Flashcard set deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete flashcard set',
      error: error.message
    });
  }
};

/**
 * Update study statistics for a card
 * @route POST /api/flashcards/:id/cards/:cardId/stats
 */
export const updateCardStats = async (req, res) => {
  try {
    const { responseTimeMs, isCorrect } = req.body;
    
    const flashcardSet = await Flashcard.findById(req.params.id);
    
    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard set not found'
      });
    }
    
    // Find the specific card
    const card = flashcardSet.flashcards.id(req.params.cardId);
    
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found in this flashcard set'
      });
    }
    
    // Update card stats
    card.updateStats(responseTimeMs, isCorrect);
    
    // Update set study stats
    flashcardSet.studyStats.lastStudied = new Date();
    flashcardSet.studyStats.totalStudySessions += 1;
    
    await flashcardSet.save();
    
    res.status(200).json({
      success: true,
      message: 'Card statistics updated successfully',
      data: card
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update card statistics',
      error: error.message
    });
  }
};