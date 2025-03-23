import dayjs from 'dayjs';
import Todo from '../models/Todo.js';
import User from '../models/User.js';
import * as todoAiService from '../services/todoAiService.js';

const createTodo = async (req, res) => {
  try {
    const { task } = req.body;
    const userId = req.user.userId;

    // Get user and their PENDING todos only
    const user = await User.findById(userId);
    const pendingTodos = await Todo.find({ 
      user: userId, 
      status: 'pending' // Only get pending todos
    });

    // Get AI suggestion for task scheduling
    const suggestedSchedule = await todoAiService.suggestTaskSchedule(
      task, 
      user.traits, 
      pendingTodos,
      {
        productivePeriod: user.productivePeriod
      }
    );

    const todo = new Todo({
      user: userId,
      task,
      scheduledDate: dayjs(suggestedSchedule.scheduledTime.start).toDate(),
      scheduledTime: suggestedSchedule.scheduledTime,
      period: suggestedSchedule.period,
      estimatedDuration: suggestedSchedule.estimatedDuration,
      priority: suggestedSchedule.priority,
      status: 'pending'
    });

    await todo.save();
    res.status(201).json({
      todo,
      message: 'Task scheduled successfully'
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ message: 'Error creating todo', error: error.message });
  }
};

const completeTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    const userId = req.user.userId;

    const todo = await Todo.findOne({ _id: todoId, user: userId });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const actualStartTime = todo.scheduledTime.start; // Use the assigned start time
    const actualEndTime = new Date(); // Use current server time
    
    const actualDuration = dayjs(actualEndTime).diff(actualStartTime, 'minute');
    const scheduledEnd = dayjs(todo.scheduledTime.end);

    // Check if completed within grace period (30 minutes after scheduled end time)
    const isOnTime = dayjs(actualEndTime).diff(scheduledEnd, 'minute') <= 30;

    todo.status = 'completed';
    todo.completedAt = actualEndTime;
    todo.actualDuration = actualDuration;
    
    await todo.save();

    // Update user traits based on completion pattern
    const user = await User.findById(userId);
    const updatedTraits = await todoAiService.updateTraitsFromCompletion(
      user.traits,
      {
        task: todo.task,
        isCompletedOnTime: isOnTime,
        scheduledDuration: todo.estimatedDuration,
        actualDuration,
        period: todo.period
      }
    );

    user.traits = updatedTraits;
    await user.save();

    res.json({ 
      todo,
      updatedTraits,
      timing: {
        startTime: actualStartTime,
        endTime: actualEndTime,
        duration: actualDuration,
        isOnTime
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error completing todo', error: error.message });
  }
};

const reassignMissedTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    const { reason } = req.body;
    const userId = req.user.userId;

    const todo = await Todo.findOne({ _id: todoId, user: userId });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const user = await User.findById(userId);
    const { period: newPeriod, traits: newTraits } = await todoAiService.suggestNewPeriodForMissed(
      todo.task,
      user.traits,
      reason
    );

    todo.status = 'pending';
    todo.assignedPeriod = newPeriod;
    todo.reassignmentReason = reason;
    await todo.save();

    user.traits = newTraits;
    await user.save();

    res.json({ todo, updatedTraits: newTraits });
  } catch (error) {
    res.status(500).json({ message: 'Error reassigning todo', error: error.message });
  }
};

// Helper function to determine period from time
const getPeriodFromTime = (time) => {
  const hour = time.hour();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'midnight';
};

const getTodos = async (req, res) => {
  try {
    const userId = req.user.userId;
    const todos = await Todo.find({ user: userId })
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos', error: error.message });
  }
};

const getTodoById = async (req, res) => {
  try {
    const { todoId } = req.params;
    const userId = req.user.userId;

    const todo = await Todo.findOne({ _id: todoId, user: userId });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todo', error: error.message });
  }
};

const reassignFailedTask = async (req, res) => {
  try {
    const { todoId } = req.params;
    const { reason } = req.body;
    const userId = req.user.userId;

    // Find the task and user
    const todo = await Todo.findOne({ _id: todoId, user: userId });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all pending todos for scheduling
    const pendingTodos = await Todo.find({
      user: userId,
      status: 'pending',
      _id: { $ne: todoId } // Exclude current todo
    });

    // Get AI suggestion for new schedule and updated traits
    const { newSchedule, updatedTraits } = await todoAiService.analyzeFailureAndReschedule(
      todo.task,
      reason,
      user.traits,
      pendingTodos
    );

    // Update the todo with new schedule
    todo.status = 'pending';
    todo.scheduledDate = dayjs(newSchedule.scheduledTime.start).toDate();
    todo.scheduledTime = newSchedule.scheduledTime;
    todo.period = newSchedule.period;
    todo.reassignmentReason = reason;
    await todo.save();

    // Update user traits
    user.traits = updatedTraits;
    await user.save();

    res.json({
      message: 'Task rescheduled successfully',
      todo,
      updatedTraits
    });
  } catch (error) {
    console.error('Error reassigning task:', error);
    res.status(500).json({ message: 'Error reassigning task', error: error.message });
  }
};

const getUserTraits = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      traits: user.traits,
      productivePeriod: user.productivePeriod
    });
  } catch (error) {
    console.error('Error fetching user traits:', error);
    res.status(500).json({ message: 'Error fetching user traits', error: error.message });
  }
};

export {
  createTodo,
  completeTodo,
  reassignMissedTodo,
  getTodos,
  getTodoById,
  reassignFailedTask,
  getUserTraits
}; 