'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveIdea } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export default function IdeaForm({ user }: { user: User }) {
  const [idea, setIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Save the initial idea to Supabase
      try {
        console.log('Attempting to save idea for user:', user.id);
        const result = await saveIdea(user.id, idea);
        console.log('Idea saved successfully:', result);
      } catch (error) {
        console.error('Error saving idea:', error);
        if (error instanceof Error) {
          alert(`Failed to save idea: ${error.message}`);
        } else {
          alert('Failed to save idea. Please try again.');
        }
        setIsLoading(false);
        return;
      }

      console.log('Sending idea to API for generation');
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea }),
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}. Please try again later.`);
      }
      
      const data = await response.json();
      
      if (data.generatedIdea) {
        router.push(`/idea?generatedIdea=${encodeURIComponent(data.generatedIdea)}`);
      } else {
        throw new Error('No idea generated');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`An error occurred: ${errorMessage}`);
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
    </div>
  );
}
