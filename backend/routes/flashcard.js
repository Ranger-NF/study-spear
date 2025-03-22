const express = require('express');
const router = express.Router();
const flashcardController = require('../controllers/flashcardController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, flashcardController.createFlashcardSet);

// Other routes...

module.exports = router;
