import express from 'express';
const router = express.Router();
import authenticateToken from '../middleware/authMiddleware.js';
import { 
  createFlashcardSet, 
  getFlashcardSets, 
  getFlashcardSet, 
  updateFlashcardSet, 
  deleteFlashcardSet, 
  updateCardStats,
  upload
} from '../controllers/flashcardController.js';
import { generateFlashcardsFromDocument } from '../services/nlpService.js';

// All routes require authentication
router.use(authenticateToken);

// Create new set (with optional file upload) and get all sets
router.post('/', upload.single('document'), createFlashcardSet);
router.get('/', getFlashcardSets);

// Single set operations
router.get('/:id', getFlashcardSet);
router.put('/:id', updateFlashcardSet);
router.delete('/:id', deleteFlashcardSet);

router.post('/generate-from-pdf', upload.single('file'), generateFlashcardsFromDocument);
// Card statistics
router.post('/:id/cards/:cardId/stats', updateCardStats);

export default router;