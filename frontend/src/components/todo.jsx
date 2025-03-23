import React, { useState, useEffect } from 'react';
import { Sun, Moon, User, Loader2, Plus, RotateCcw, Check, X, Clock, Sunrise, Sunset } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Sidebar from './sidebar';

const TodoPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTaskText, setNewTaskText] = useState('');
  const [showNewTaskInput, setShowNewTaskInput] = useState(false);
  const [reassignReason, setReassignReason] = useState('');
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const navigate = useNavigate();

  // Get auth token
  const token = localStorage.getItem('userToken');
  if (!token) {
    navigate('/login');
  }

  // Check user traits
  const checkUserTraits = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/todos/user/traits`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user traits');
      }

      const data = await response.json();
      
      // If traits array is empty or doesn't exist, redirect to onboarding
      if (!data.traits || data.traits.length === 0) {
        navigate('/onboarding');
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error checking user traits:', err);
      setError('Failed to check user traits. Please try again.');
      return false;
    }
  };

  // Check if task deadline has passed


  // Get time period info
  const getTimePeriodInfo = (period) => {
    switch (period) {
      case 'morning':
        return { 
          icon: <Sunrise className="h-5 w-5 text-yellow-500" />,
          label: 'Morning',
          description: '5 AM - 11:59 AM',
          color: 'bg-yellow-50 border-yellow-200'
        };
      case 'afternoon':
        return { 
          icon: <Sun className="h-5 w-5 text-orange-500" />,
          label: 'Afternoon',
          description: '12 PM - 4:59 PM',
          color: 'bg-orange-50 border-orange-200'
        };
      case 'evening':
        return { 
          icon: <Sunset className="h-5 w-5 text-red-500" />,
          label: 'Evening',
          description: '5 PM - 7:59 PM',
          color: 'bg-red-50 border-red-200'
        };
      case 'midnight':
        return { 
          icon: <Moon className="h-5 w-5 text-blue-500" />,
          label: 'Night',
          description: '8 PM - 4:59 AM',
          color: 'bg-blue-50 border-blue-200'
        };
      default:
        return { 
          icon: <Clock className="h-5 w-5 text-gray-500" />,
          label: 'Uncategorized Tasks',
          description: 'No specific time',
          color: 'bg-gray-50 border-gray-200'
        };
    }
  };

  // Format deadline
  const formatDeadline = (createdAt) => {
    if (!createdAt) return 'No date set';
    
    const date = dayjs(createdAt);
    if (!date.isValid()) return 'Invalid date';

    const now = dayjs();
    const tomorrow = now.add(1, 'day').startOf('day');
    const isToday = date.isSame(now, 'day');
    const isTomorrow = date.isSame(tomorrow, 'day');
    
    let dateStr;
    if (isToday) {
      dateStr = 'Today';
    } else if (isTomorrow) {
      dateStr = 'Tomorrow';
    } else {
      dateStr = date.format('MMM D');
    }

    return `${dateStr}, ${date.format('h:mm A')}`;
  };

  // Group tasks by period
  const groupTasksByPeriod = (tasks) => {
    const periods = ['morning', 'afternoon', 'evening', 'midnight'];
    const grouped = {};
    
    // Initialize all periods with empty arrays
    periods.forEach(period => {
      grouped[period] = [];
    });

    // Group tasks by period
    tasks.forEach(task => {
      const period = task.period || 'unassigned';
      if (!grouped[period]) {
        grouped[period] = [];
      }
      grouped[period].push(task);
    });

    return grouped;
  };

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      // First check if user has traits
      const hasTraits = await checkUserTraits();
      if (!hasTraits) return;

      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/todos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }

      const data = await response.json();
      // Include both pending and missed tasks, exclude completed ones
      setTasks(data.filter(todo => todo.status !== 'completed'));
      setError(null);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Complete task
  const completeTask = async (todoId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/todos/${todoId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to complete task');
      }

      setTasks(prevTasks => prevTasks.filter(task => task._id !== todoId));
    } catch (err) {
      setError('Failed to complete task. Please try again.');
    }
  };

  // Add new task
  const addNewTask = async () => {
    if (!newTaskText.trim()) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/todos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task: newTaskText })
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      await fetchTodos();
      setNewTaskText('');
      setShowNewTaskInput(false);
    } catch (err) {
      setError('Failed to create task. Please try again.');
    }
  };

  // Reassign task
  const reassignTask = async () => {
    if (!selectedTaskId || !reassignReason.trim()) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/todos/${selectedTaskId}/reassign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: reassignReason })
      });

      if (!response.ok) {
        throw new Error('Failed to reassign task');
      }

      await fetchTodos();
      setShowReassignModal(false);
      setReassignReason('');
      setSelectedTaskId(null);
    } catch (err) {
      setError('Failed to reassign task. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
    );
  }

  const groupedTasks = groupTasksByPeriod(tasks);
  const periods = ['morning', 'afternoon', 'evening', 'midnight'];

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 h-screen overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            <div className="border border-gray-300 rounded-lg p-6 bg-white">
              <h1 className="text-2xl font-semibold text-center mb-6">Energy Manager</h1>
              
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
                  {error}
              </div>
              )}

              {/* Tasks List Grouped by Period */}
              <div className="space-y-6">
                {periods.map(period => {
                  const periodInfo = getTimePeriodInfo(period);
                  const periodTasks = groupedTasks[period] || [];

                  if (periodTasks.length === 0) return null;

                  return (
                    <div key={period} className={`rounded-lg border p-4 ${periodInfo.color}`}>
                      <div className="flex items-center gap-2 mb-4">
                        {periodInfo.icon}
                        <div>
                          <h2 className="font-semibold text-lg">{periodInfo.label}</h2>
                          <p className="text-sm text-gray-600">{periodInfo.description}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                        {periodTasks.map((task) => (
                          <div 
                            key={task._id} 
                            className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow ${
                              task.status === 'missed' ? 'opacity-60' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium mb-2">{task.task}</p>
                                <div className="flex items-center text-xs text-gray-400">
                                  <Clock size={12} className="mr-1 text-gray-400" />
                                  <span>Created at {formatDeadline(task.createdAt)}</span>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                {task.status !== 'missed' ? (
                                  <button
                                    onClick={() => completeTask(task._id)}
                                    className="p-2 text-green-500 hover:bg-green-50 rounded"
                                    title="Complete"
                                  >
                                    <Check size={16} />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setSelectedTaskId(task._id);
                                      setShowReassignModal(true);
                                    }}
                                    className="p-2 text-yellow-500 hover:bg-yellow-50 rounded"
                                    title="Reassign Missed Task"
                                  >
                                    <RotateCcw size={16} />
                                  </button>
                                )}
                              </div>
                            </div>
                  </div>
                ))}
              </div>
            </div>
                  );
                })}

                {Object.values(groupedTasks).every(tasks => tasks.length === 0) && (
                  <div className="text-center text-gray-500 py-8">
                    No tasks available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add New Task - Fixed at Bottom */}
        <div className="p-6 bg-white border-t">
          <div className="max-w-4xl mx-auto">
            {showNewTaskInput ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Enter task..."
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setShowNewTaskInput(false);
                      setNewTaskText('');
                    }}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X size={16} />
                  </button>
                  <button
                    onClick={addNewTask}
                    className="p-1 text-green-500 hover:bg-green-50 rounded"
                  >
                    <Check size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowNewTaskInput(true)}
                className="w-full p-2 border border-dashed border-gray-300 rounded-md text-gray-500 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center"
              >
                <Plus size={16} className="mr-1" />
                Add Entry
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reassign Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Reassign Missed Task</h3>
            <p className="text-sm text-gray-500 mb-4">
              This task was not completed during its scheduled time. Please provide a reason for reassignment.
            </p>
            <textarea
              value={reassignReason}
              onChange={(e) => setReassignReason(e.target.value)}
              placeholder="Why wasn't the task completed? This will help us schedule it better next time..."
              className="w-full p-2 border border-gray-300 rounded mb-4 h-32"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowReassignModal(false);
                  setReassignReason('');
                  setSelectedTaskId(null);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={reassignTask}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Reassign Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoPage;