const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { processAnswers, getQuestions } = require('../controllers/onboardAnswer');

router.post('/', authenticateToken, processAnswers);
router.get('/', getQuestions);

// Other routes...

module.exports = router;
