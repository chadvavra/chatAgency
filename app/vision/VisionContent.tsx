'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";
import { FaSpinner } from 'react-icons/fa';

const VisionContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [visionStatement, setVisionStatement] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [generatedIdea, setGeneratedIdea] = useState('');

  const questions = [
    "What is the primary goal or purpose of your idea?",
    "Who will benefit from your idea?",
    "What impact do you want to make in the world?",
    "What values are most important to you in pursuing this vision?",
    "Where do you see your idea in 5 years?"
  ];

  useEffect(() => {
    const urlAnswers = searchParams.get('answers');
    const ideaId = searchParams.get('id');
    if (urlAnswers) {
      setAnswers(JSON.parse(decodeURIComponent(urlAnswers)));
    }
    if (ideaId) {
      fetchGeneratedIdea(ideaId);
    }
  }, [searchParams]);

  const fetchGeneratedIdea = async (ideaId: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('ideas')
      .select('generated_idea')
      .eq('id', ideaId)
      .single();

    if (error) {
      console.error('Error fetching generated idea:', error);
    } else if (data) {
      setGeneratedIdea(data.generated_idea);
    }
  };

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      generateVisionStatement();
    }
  };

  const handleGenerateVision = () => {
    if (Object.keys(answers).length === questions.length) {
      generateVisionStatement();
    } else {
      setError('Please answer all questions before generating the vision statement.');
    }
  };

  const generateVisionStatement = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const prompt = `Generate a compelling vision statement based on the following information:
        Primary goal: ${answers[0]}
        Beneficiaries: ${answers[1]}
        Desired impact: ${answers[2]}
        Core values: ${answers[3]}
        5-year vision: ${answers[4]}
        
        Generated Idea: ${generatedIdea}
        
        Please create a concise, inspiring vision statement that captures the essence of this idea and its potential impact, taking into account the details of the generated idea.`;

      const response = await fetch('/api/vision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}. Please try again later.`);
      }

      const data = await response.json();
      setVisionStatement(data.generatedText);
    } catch (error) {
      console.error('Error generating vision statement:', error);
      setError('An error occurred while generating the vision statement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveVision = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('ideas')
          .insert({ user_id: user.id, vision: visionStatement })
          .select();

        if (error) throw error;

        setIsSaved(true);
        alert('Vision statement saved successfully!');
      } else {
        alert('You must be logged in to save vision statements.');
      }
    } catch (error) {
      console.error('Error saving vision statement:', error);
      alert('Failed to save vision statement. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Develop Your Vision</h1>
      
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
              disabled={!answers[currentQuestion]}
            >
              {currentQuestion === questions.length - 1 ? 'Next' : 'Next'}
            </button>
          </div>
        </div>
      ) : !visionStatement ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Review Your Answers:</h2>
          {questions.map((question, index) => (
            <div key={index} className="mb-4">
              <p className="font-semibold">{question}</p>
              <p className="ml-4">{answers[index]}</p>
            </div>
          ))}
          <button 
            onClick={handleGenerateVision}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Generate Vision
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Vision Statement:</h2>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <FaSpinner className="animate-spin text-4xl text-blue-500 mr-3" />
              <p className="text-gray-600">Generating vision statement...</p>
            </div>
          ) : error ? (
            <div>
              <p className="text-red-500">{error}</p>
              <button
                onClick={generateVisionStatement}
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <p className="p-4 bg-white rounded shadow">{visionStatement}</p>
              {!isSaved && (
                <button 
                  onClick={saveVision}
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save Vision
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default VisionContent;
