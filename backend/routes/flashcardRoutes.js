import express from 'express';
import { 
  createFlashcardSet, 
  getFlashcardSets, 
  getFlashcardSet, 
  updateFlashcardSet, 
  deleteFlashcardSet, 
  updateCardStats,
  upload
} from '../controllers/flashcardController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes that require authentication
router.use(authenticateToken);

// Flashcard set routes
router.route('/')
  .post(upload.single('document'), createFlashcardSet) // Create new set (with optional file upload)
  .get(getFlashcardSets); // Get all sets for user

router.route('/:id')
  .get(getFlashcardSet) // Get single set
  .put(updateFlashcardSet) // Update set
  .delete(deleteFlashcardSet); // Delete set

// Card statistics route
router.post('/:id/cards/:cardId/stats', updateCardStats);

export default router;