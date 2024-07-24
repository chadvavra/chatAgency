'use client';

import React, { useState } from 'react';

export default function IdeaForm() {
  const [idea, setIdea] = useState('');
  const [generatedIdea, setGeneratedIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.generatedIdea) {
        setGeneratedIdea(data.generatedIdea);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error('No idea generated');
      }
    } catch (error) {
      console.error('Error:', error);
      setGeneratedIdea('An error occurred while generating the idea. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="idea" className="block text-sm font-medium text-gray-700">
            Your Business Idea or Product Feature
          </label>
          <textarea
            id="idea"
            name="idea"
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Detailed Idea'}
        </button>
      </form>
      {generatedIdea && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Generated Idea:</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{generatedIdea}</p>
        </div>
      )}
    </div>
  );
}
