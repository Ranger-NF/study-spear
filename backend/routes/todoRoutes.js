import express from 'express';
import { createTodo, completeTodo, getTodos, getTodoById, reassignFailedTask, getUserTraits } from '../controllers/todoController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all todos for the authenticated user
router.get('/',authenticateToken, getTodos);

// Get a specific todo by ID
router.get('/:todoId',authenticateToken, getTodoById);

// Get user traits
router.get('/user/traits', authenticateToken, getUserTraits);

router.post('/',authenticateToken, createTodo);
router.post('/:todoId/complete',authenticateToken, completeTodo);
router.post('/:todoId/reassign',authenticateToken, reassignFailedTask);

export default router; 