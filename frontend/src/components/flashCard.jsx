import React, { useState } from 'react';

const FlashcardOverlay = () => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentCard, setCurrentCard] = useState(1);
  const totalCards = 20;

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div className=" flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-6 relative">
        <div className="absolute top-6 right-6 text-sm text-gray-500">
          {currentCard} / {totalCards}
        </div>

        <div className="mt-4">
          <div className="border border-gray-200 rounded-md overflow-hidden">
            {/* Question Section */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-center">
                <span className="font-bold">Q : </span>
                What is the powerhouse of the cell?
              </h2>
            </div>

            {/* Answer Section */}
            <div className="p-6">
              <div className="border border-gray-200 rounded-md min-h-64 flex items-center justify-center p-4">
                {showAnswer ? (
                  <p className="text-center">The mitochondria is the powerhouse of the cell. It produces energy through cellular respiration, converting nutrients into ATP (adenosine triphosphate), which cells use for various functions.</p>
                ) : (
                  <button
                    onClick={toggleAnswer}
                    className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Show Answer
                  </button>
                )}
              </div>
            </div>

            {/* Citation Section */}
            <div className="p-4 border-t border-gray-200">
              <ul className="list-disc pl-6 text-sm text-gray-600">
                <li>Alberts, B. et al. (2014). Molecular Biology of the Cell (6th ed.). Garland Science.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardOverlay;