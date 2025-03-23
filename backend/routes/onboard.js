import express from 'express';
const router = express.Router();
import authenticateToken from '../middleware/authMiddleware.js';
import { processAnswers, getQuestions } from '../controllers/onboardAnswer.js';

router.post('/', authenticateToken, processAnswers);
router.get('/', getQuestions);

// Other routes...
export default router;
