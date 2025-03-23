import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});

  // Get auth token
  const token = localStorage.getItem("userToken");
  if (!token) {
    navigate("/login");
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log(
          "Fetching from:",
          `${import.meta.env.VITE_BACKEND_API_URL}/api/onboarding`,
        );
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/api/onboarding`,
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(
            `Failed to fetch questions: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();
        console.log("Received questions:", data);

        if (!Array.isArray(data)) {
          throw new Error("Expected array of questions but got " + typeof data);
        }

        setQuestions(data);

        // Initialize answers object with question and answer fields
        const initialAnswers = data.map((question) => ({
          question: question.question,
          answer: "",
        }));
        setAnswers(initialAnswers);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleOptionSelect = (answer) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentStep] = {
        ...newAnswers[currentStep],
        answer: answer,
      };
      return newAnswers;
    });
  };

  const handleTextInput = (e) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentStep] = {
        ...newAnswers[currentStep],
        answer: e.target.value,
      };
      return newAnswers;
    });
  };

  const handleNext = async () => {
    // Check if current answer is empty
    if (!answers[currentStep]?.answer) {
      setError("Please provide an answer before continuing");
      return;
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setError(null);
    } else {
      try {
        // Submit answers to backend
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API_URL}/api/onboarding`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ answers }),
          },
        );

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData || "Failed to submit answers");
        }

        // Navigate to todo page after successful submission
        navigate("/todo");
      } catch (err) {
        console.error("Submission error:", err);
        setError(err.message);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setError(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6 whitespace-pre-wrap">{error}</p>
          <button
            onClick={() => setError(null)}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];
  const currentAnswer = answers[currentStep]?.answer || "";

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="flex-1 h-screen overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto p-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentStep + 1) / questions.length) * 100}%`,
                  }}
                ></div>
              </div>

              <div className="mt-8">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
                  Personalize Your Experience
                </h1>
                <p className="text-center text-gray-600">
                  Step {currentStep + 1} of {questions.length}
                </p>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-medium text-gray-900 mb-6">
                  {currentQuestion.question}
                </h2>

                {currentQuestion.type === 0 ? (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(option)}
                        className={`w-full text-left p-4 rounded-lg border ${
                          currentAnswer === option
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                        } transition-all duration-200`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <textarea
                    value={currentAnswer}
                    onChange={handleTextInput}
                    placeholder="Type your answer here..."
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons - Fixed at Bottom */}
        <div className="p-6 bg-white border-t">
          <div className="max-w-2xl mx-auto flex justify-between">
            <button
              onClick={handleBack}
              className={`flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                currentStep === 0 ? "invisible" : ""
              }`}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!currentAnswer}
              className={`flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-white ${
                !currentAnswer
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {currentStep === questions.length - 1 ? "Finish" : "Next"}
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
