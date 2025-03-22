const express = require('express');
const router = express.Router();
const { 
  createTodo, 
  completeTodo, 
  reassignMissedTodo,
  getTodos,
  getTodoById
} = require('../controllers/todoController');
const authenticateToken = require('../middleware/authMiddleware');

// Get all todos for the authenticated user
router.get('/', authenticateToken, getTodos);

// Get a specific todo by ID
router.get('/:todoId', authenticateToken, getTodoById);

router.post('/', authenticateToken, createTodo);
router.put('/:todoId/complete', authenticateToken, completeTodo);
router.put('/:todoId/reassign', authenticateToken, reassignMissedTodo);

module.exports = router; 