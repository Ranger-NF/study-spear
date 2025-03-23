import express from 'express';
import { createTodo, completeTodo, getTodos, getTodoById, reassignFailedTask } from '../controllers/todoController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all todos for the authenticated user
router.get('/',authenticateToken, getTodos);

// Get a specific todo by ID
router.get('/:todoId',authenticateToken, getTodoById);

router.post('/',authenticateToken, createTodo);
router.put('/:todoId/complete',authenticateToken, completeTodo);
router.post('/:todoId/reassign',authenticateToken, reassignFailedTask);

export default router; 