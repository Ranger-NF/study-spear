import React, { useState } from 'react';
import { Calendar, CheckSquare, Book, Clock, Home, Settings, BarChart, BookOpen, Users, Search } from 'lucide-react';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');

  // Sample data
  const upcomingDeadlines = [
    { id: 1, task: 'Physics Assignment', course: 'PHY101', dueDate: 'Tomorrow, 11:59 PM' },
    { id: 2, task: 'Math Quiz', course: 'MTH201', dueDate: 'Mar 24, 2:00 PM' },
    { id: 3, task: 'Literature Essay', course: 'LIT303', dueDate: 'Mar 25, 5:00 PM' }
  ];

  const studySessions = [
    { id: 1, subject: 'Organic Chemistry', duration: '45 mins', material: 'Chapter 4' },
    { id: 2, subject: 'Calculus', duration: '30 mins', material: 'Practice Problems' },
    { id: 3, subject: 'History', duration: '60 mins', material: 'Research Paper Prep' }
  ];

  const examPrep = [
    { id: 1, exam: 'Midterm - Biology', date: 'Mar 28', importance: 'high' },
    { id: 2, exam: 'Quiz - Economics', date: 'Mar 25', importance: 'medium' },
    { id: 3, exam: 'Final - Programming', date: 'Apr 15', importance: 'high' }
  ];

  const renderPagePreview = (page) => {
    switch(page) {
      case 'flashcards':
        return (
          <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer h-48">
            <div className="mb-2">
              <BookOpen size={32} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-medium">Flashcards</h3>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Review key concepts with interactive flashcards and track your learning progress
            </p>
          </div>
        );
      case 'tasks':
        return (
          <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer h-48">
            <div className="mb-2">
              <CheckSquare size={32} className="text-green-600" />
            </div>
            <h3 className="text-lg font-medium">Task Manager</h3>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Organize upcoming, ongoing, and completed tasks to stay on track
            </p>
          </div>
        );
      case 'materials':
        return (
          <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer h-48">
            <div className="mb-2">
              <Book size={32} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-medium">Learning Materials</h3>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Access course materials sorted by difficulty and relevance to exams
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Sidebar */}
      <div className="flex h-screen">
        <div className="w-16 md:w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold hidden md:block">StudyHub</h1>
            <div className="md:hidden flex justify-center">
              <BookOpen size={24} />
            </div>
          </div>
          
          <nav className="flex-1 pt-4">
            <ul>
              {[
                { id: 'home', icon: Home, label: 'Dashboard' },
                { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
                { id: 'flashcards', icon: Book, label: 'Flashcards' },
                { id: 'materials', icon: BookOpen, label: 'Materials' },
                { id: 'calendar', icon: Calendar, label: 'Calendar' },
                { id: 'analytics', icon: BarChart, label: 'Analytics' },
                { id: 'study-groups', icon: Users, label: 'Study Groups' }
              ].map(item => (
                <li key={item.id} className="mb-1">
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center py-2 px-4 w-full ${
                      activeTab === item.id 
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon size={20} className="flex-shrink-0" />
                    <span className="ml-3 hidden md:block">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <button className="flex items-center py-2 text-gray-600 hover:text-gray-900 w-full">
              <Settings size={20} />
              <span className="ml-3 hidden md:block">Settings</span>
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">{activeTab === 'home' ? 'Dashboard' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            
            <div className="flex items-center">
              <div className="relative mr-4">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-md"
                />
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              </div>
              
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                <span>JS</span>
              </div>
            </div>
          </header>
          
          {/* Dashboard Content */}
          <main className="p-6">
            {activeTab === 'home' && (
              <>
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Quick Access</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {renderPagePreview('flashcards')}
                    {renderPagePreview('tasks')}
                    {renderPagePreview('materials')}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Upcoming Deadlines */}
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center mb-4">
                      <Clock size={20} className="text-red-500 mr-2" />
                      <h3 className="font-medium">Upcoming Deadlines</h3>
                    </div>
                    <ul className="space-y-3">
                      {upcomingDeadlines.map(item => (
                        <li key={item.id} className="border-b border-gray-100 pb-2">
                          <p className="font-medium">{item.task}</p>
                          <div className="flex justify-between mt-1 text-sm">
                            <span className="text-gray-500">{item.course}</span>
                            <span className="text-red-500">{item.dueDate}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Recommended Study Sessions */}
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center mb-4">
                      <Book size={20} className="text-blue-500 mr-2" />
                      <h3 className="font-medium">Recommended Study</h3>
                    </div>
                    <ul className="space-y-3">
                      {studySessions.map(item => (
                        <li key={item.id} className="border-b border-gray-100 pb-2">
                          <p className="font-medium">{item.subject}</p>
                          <div className="flex justify-between mt-1 text-sm">
                            <span className="text-gray-500">{item.material}</span>
                            <span className="text-blue-500">{item.duration}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Exam Preparation */}
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center mb-4">
                      <Calendar size={20} className="text-purple-500 mr-2" />
                      <h3 className="font-medium">Exam Preparation</h3>
                    </div>
                    <ul className="space-y-3">
                      {examPrep.map(item => (
                        <li key={item.id} className="border-b border-gray-100 pb-2">
                          <p className="font-medium">{item.exam}</p>
                          <div className="flex justify-between mt-1 text-sm">
                            <span className="text-gray-500">{item.date}</span>
                            <span className={`${
                              item.importance === 'high' ? 'text-red-500' : 
                              item.importance === 'medium' ? 'text-yellow-500' : 'text-green-500'
                            }`}>
                              {item.importance.charAt(0).toUpperCase() + item.importance.slice(1)} priority
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;