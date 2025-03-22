import React, { useState } from 'react';
import Header from '../components/header';

const FlashcardPage = () => {
  const [files, setFiles] = useState([]);
  
  const handleAddFile = () => {
    // This would typically open a file dialog
    // For demonstration, we'll just add a placeholder file
    setFiles([...files, { id: Date.now(), name: `File ${files.length + 1}` }]);
  };
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="full-height flex p-4 gap-4 h-96">
        {/* Sources Panel */}
        <div className="w-1/4 border border-gray-300 rounded p-4 bg-white">
          <h2 className="text-xl font-semibold text-center mb-4">Sources</h2>
          
          <button 
            onClick={handleAddFile}
            className="flex items-center gap-2 mx-auto mb-4 p-2 rounded-full border border-gray-300 hover:bg-gray-100"
          >
            <span className="inline-flex items-center justify-center w-6 h-6 text-lg">+</span>
            <span>Add File</span>
          </button>
          
          <div className="space-y-2">
            {files.map(file => (
              <div key={file.id} className="p-2 border border-gray-200 rounded hover:bg-gray-50">
                {file.name}
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="w-3/4 border border-gray-300 rounded p-4 bg-white">
          {files.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <p className="text-lg">Add Resources to Start Creating Flash Cards</p>
              <div className="relative mb-4">
                <div className="w-16 h-20 border-2 border-gray-800 rounded bg-white absolute left-0"></div>
                <div className="w-16 h-20 border-2 border-gray-800 rounded bg-white absolute left-2 transform rotate-6"></div>
              </div>
              
            </div>
          ) : (
            <div className="h-full">
              <h2 className="text-xl font-semibold mb-4">Your Flash Cards</h2>
              <div className="grid grid-cols-2 gap-4">
                {files.map(file => (
                  <div key={file.id} className="border border-gray-200 rounded p-4 h-40 flex items-center justify-center hover:shadow-md cursor-pointer">
                    <p>Flash Card for {file.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardPage;