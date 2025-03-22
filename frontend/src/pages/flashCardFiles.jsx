import React, { useState } from 'react';

const LearningPlatform = () => {
  const [selectedFiles, setSelectedFiles] = useState([
    { id: 1, name: 'Sample file' },
    { id: 2, name: 'Sample file' },
    { id: 3, name: 'Sample file' },
    { id: 4, name: 'Sample file' },
    { id: 5, name: 'Sample file' }
  ]);

  const difficultyLevels = [
    { id: 1, name: 'Easy Topics', icon: 'battery-low' },
    { id: 2, name: 'Medium Topics', icon: 'battery-medium' },
    { id: 3, name: 'Hard Topics', icon: 'battery-high' }
  ];

  const addNewFile = () => {
    const newId = selectedFiles.length + 1;
    setSelectedFiles([...selectedFiles, { id: newId, name: 'Sample file' }]);
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* Left Panel - Sources */}
      <div className="w-1/3 border-r border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-6">Sources</h2>
        <div className="space-y-4">
          {selectedFiles.map(file => (
            <div key={file.id} className="flex items-center">
              <div className="w-6 h-6 rounded-full border border-gray-400 mr-4"></div>
              <span>{file.name}</span>
            </div>
          ))}
          <div className="flex items-center cursor-pointer" onClick={addNewFile}>
            <div className="w-6 h-6 rounded-full border border-gray-400 mr-4 flex items-center justify-center">
              <span className="text-gray-500">+</span>
            </div>
            <span>Add File</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Difficulty Selection */}
      <div className="w-2/3 p-6 flex flex-col items-center justify-center">
        <div className="grid grid-cols-3 gap-6 mb-12 w-full max-w-5xl">
          {difficultyLevels.map(level => (
            <div key={level.id} className="border border-gray-200 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mb-4 relative">
                {/* Battery Icon with Lightning */}
                <div className="w-12 h-16 bg-white border-2 border-gray-800 mx-auto rounded-md relative">
                  <div className="w-6 h-3 bg-gray-800 absolute -top-3 left-3 rounded-t-md"></div>
                  <div className="absolute inset-2">
                    {level.icon === 'battery-low' && <div className="h-1/3 bg-gray-800 absolute bottom-0 w-full"></div>}
                    {level.icon === 'battery-medium' && <div className="h-2/3 bg-gray-800 absolute bottom-0 w-full"></div>}
                    {level.icon === 'battery-high' && <div className="h-full bg-gray-800 absolute bottom-0 w-full"></div>}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold">
                      ⚡
                    </div>
                  </div>
                </div>
                {/* Play Button Overlay */}
                <div className="absolute top-1/2 left-full -translate-y-1/2 -translate-x-1/2 w-10 h-10">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-16 border-l-white border-b-8 border-b-transparent filter drop-shadow-md"></div>
                </div>
              </div>
              <h3 className="text-lg font-medium">{level.name}</h3>
            </div>
          ))}
        </div>
        <p className="text-xl font-medium text-center">
          Choose Type of Difficulty and Start Learning
        </p>
      </div>
    </div>
  );
};

export default LearningPlatform;