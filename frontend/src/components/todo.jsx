import React, { useState } from 'react';
import { Sun, Moon, User } from 'lucide-react';
import Sidebar from './sidebar';

const TodoPage = () => {
  const [upcomingTasks, setUpcomingTasks] = useState([
    'Team meetings / stand-ups',
    'Write or update documentation',
    'Explore new tech (read blogs, watch tutorials)'
  ]);
  
  const [ongoingTasks, setOngoingTasks] = useState([
    'Review yesterday\'s code',
    'Plan daily tasks & priorities',
    'Deep coding session (feature development)'
  ]);
  
  const [completedTasks, setCompletedTasks] = useState([
    'Debug & optimize code',
    'Code reviews & merge pull',
    'Implement API integrations',
    'Database updates & maintenance'
  ]);
  
  const addNewTask = () => {
    setUpcomingTasks([...upcomingTasks, 'New task']);
  };

  return (
    <div className="min-h-screen">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <div className="max-w-6xl mx-auto p-6">
            <div className="border border-gray-300 rounded-lg p-6 bg-white">
              <h1 className="text-2xl font-semibold text-center mb-6">To-Do</h1>
              
              <div className="grid grid-cols-3 gap-4">
                {/* Upcoming Tasks Column */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h2 className="text-lg font-medium text-center mb-4">Upcoming tasks</h2>
                  
                  <div className="space-y-3">
                    {upcomingTasks.map((task, index) => (
                      <div key={`upcoming-${index}`} className="border border-gray-200 rounded p-2">
                        <p className="flex">
                          <span className="mr-2">•</span>
                          {task}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <button 
                      onClick={addNewTask}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                    >
                      <span>+</span>
                    </button>
                  </div>
                </div>
                
                {/* Ongoing Tasks Column */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h2 className="text-lg font-medium text-center mb-4">Ongoing tasks</h2>
                  
                  <div className="flex flex-col items-center mb-4">
                    <div className="relative h-40 flex flex-col items-center">
                      <User size={16} className="absolute top-0" />
                      <div className="h-full border-l border-gray-300"></div>
                      <Sun size={16} className="absolute top-1/2 -translate-y-1/2" />
                      <Moon size={16} className="absolute bottom-0" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {ongoingTasks.map((task, index) => (
                      <div key={`ongoing-${index}`} className="border border-gray-200 rounded p-2">
                        <p className="flex">
                          <span className="mr-2">•</span>
                          {task}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Completed Tasks Column */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h2 className="text-lg font-medium text-center mb-4">Completed tasks</h2>
                  
                  <div className="space-y-3">
                    {completedTasks.map((task, index) => (
                      <div key={`completed-${index}`} className="border border-gray-200 rounded p-2">
                        <p className="flex text-gray-500">
                          <span className="mr-2">•</span>
                          {task}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoPage;