'use client';

import { useState } from 'react';
import { oswald, plex } from '../../utils/fonts';
import { generateIdea } from '../../utils/anthropic';

export default function VisionPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visionStatement, setVisionStatement] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    "What is the primary goal or purpose of your idea?",
    "Who will benefit from your idea?",
    "What impact do you want to make in the world?",
    "What values are most important to you in pursuing this vision?",
    "Where do you see your idea in 5 years?"
  ];

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      generateVisionStatement();
    }
  };

  const generateVisionStatement = async () => {
    setIsLoading(true);
    try {
      const prompt = `Generate a compelling vision statement based on the following information:
        Primary goal: ${answers[0]}
        Beneficiaries: ${answers[1]}
        Desired impact: ${answers[2]}
        Core values: ${answers[3]}
        5-year vision: ${answers[4]}
        
        Please create a concise, inspiring vision statement that captures the essence of this idea and its potential impact.`;

      const statement = await generateIdea(prompt);
      setVisionStatement(statement);
    } catch (error) {
      console.error('Error generating vision statement:', error);
      setVisionStatement('An error occurred while generating the vision statement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className={`{plex.className} text-4xl font-bold text-gray-900 mb-8 text-center`}>
          Develop Your Vision
        </h1>
        
        <div className={`{oswald.className} text-lg text-gray-700 space-y-6`}>
          {currentQuestion < questions.length ? (
            <div>
              <p className="mb-2 text-sm text-gray-500">Question {currentQuestion + 1} of {questions.length}</p>
              <p className="mb-4">{questions[currentQuestion]}</p>
              <textarea 
                className="w-full p-2 border border-gray-300 rounded"
                rows={4}
                value={answers[currentQuestion] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
              />
              <div className="flex justify-between mt-4">
                <button 
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </button>
                <button 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={handleNext}
                  disabled={isLoading || !answers[currentQuestion]}
                >
                  {currentQuestion === questions.length - 1 ? 'Generate Vision' : 'Next'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Vision Statement:</h2>
              {isLoading ? (
                <p className="text-gray-600">Generating vision statement...</p>
              ) : (
                <p className="p-4 bg-white rounded shadow">{visionStatement}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
