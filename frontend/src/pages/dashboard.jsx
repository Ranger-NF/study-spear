import React, { useState, useEffect, useRef } from 'react';
import { Clock, Search, BookOpen, CheckSquare, LogOut, User } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Sidebar from '../components/sidebar';

const StudentDashboard = () => {
  const activeTab = 'home';
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for authentication
    const token = localStorage.getItem('userToken');
    const storedUserData = localStorage.getItem('userData');

    if (!token) {
      navigate('/login');
      return;
    }

    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

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
          <div onClick={() => navigate("/frontend/src/pages/flashCardFiles.jsx")} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer h-48">
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
          <div onClick={() => navigate("/todo")} className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer h-48">
            <div className="mb-2">
              <CheckSquare size={32} className="text-green-600" />
            </div>
            <h3 className="text-lg font-medium">Task Manager</h3>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Organize upcoming, ongoing, and completed tasks to stay on track
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex">
        <Sidebar />
        
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
              
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <span>{userData ? getInitials(userData.name) : 'U'}</span>
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{userData?.name}</p>
                      <p className="text-sm text-gray-500">{userData?.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {/* Add profile page navigation here */}}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>
          
          {/* Dashboard Content */}
          <main className="p-6">
            {activeTab === 'home' && (
              <>
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Quick Access</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderPagePreview('flashcards')}
                    {renderPagePreview('tasks')}
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
                  
                  {/* Study Sessions */}
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center mb-4">
                      <Clock size={20} className="text-blue-500 mr-2" />
                      <h3 className="font-medium">Study Sessions</h3>
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
                      <Clock size={20} className="text-purple-500 mr-2" />
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