'use client';

import { useState } from 'react';
import { oswald, plex } from '../../utils/fonts';

export default function VisionPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visionStatement, setVisionStatement] = useState('');

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
    } else {
      generateVisionStatement();
    }
  };

  const generateVisionStatement = async () => {
    // Here you would typically make an API call to your AI service
    // For now, we'll just combine the answers into a simple statement
    const statement = `Our vision is to ${answers[0]} for ${answers[1]}. 
    We aim to ${answers[2]} while upholding the values of ${answers[3]}. 
    In 5 years, we envision ${answers[4]}.`;
    setVisionStatement(statement);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className={`${plex.className} text-4xl font-bold text-gray-900 mb-8 text-center`}>
          Develop Your Vision
        </h1>
        
        <div className={`${oswald.className} text-lg text-gray-700 space-y-6`}>
          {currentQuestion < questions.length ? (
            <div>
              <p className="mb-4">{questions[currentQuestion]}</p>
              <textarea 
                className="w-full p-2 border border-gray-300 rounded"
                rows={4}
                onChange={(e) => handleAnswer(e.target.value)}
              />
              <button 
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => handleAnswer(document.querySelector('textarea').value)}
              >
                {currentQuestion === questions.length - 1 ? 'Generate Vision' : 'Next'}
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Vision Statement:</h2>
              <p className="p-4 bg-white rounded shadow">{visionStatement}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
