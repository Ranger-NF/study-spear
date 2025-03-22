import express from 'express';
import { createFlashcardSet } from '../controllers/flashcardController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, createFlashcardSet);

export default router; 