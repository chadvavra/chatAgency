'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, updateDetailedIdea } from "@/utils/supabase/client";

const IdeaPageContent: React.FC = () => {
  const router = useRouter();
  const [generatedIdea, setGeneratedIdea] = useState('');
  const [changeRequest, setChangeRequest] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { searchParams } = new URL(window.location.href);
    setGeneratedIdea(searchParams.get('generatedIdea') || '');
  }, []);

  const handleChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea: generatedIdea, changeRequest }),
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}. Please try again later.`);
      }
      
      const data = await response.json();
      
      if (data.generatedIdea) {
        setGeneratedIdea(data.generatedIdea);
        setChangeRequest('');
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

  const handleContinue = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await updateDetailedIdea(user.id, generatedIdea);
    }
    router.push(`/value-propositions?idea=${encodeURIComponent(generatedIdea)}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Generated Idea:</h2>
        <p className="text-gray-700 whitespace-pre-wrap bg-gray-100 p-4 rounded-md">{generatedIdea}</p>
      </div>
      <form onSubmit={handleChangeRequest} className="space-y-4">
        <div>
          <label htmlFor="changeRequest" className="block text-sm font-medium text-gray-700">
            Request Changes or Improvements
          </label>
          <textarea
            id="changeRequest"
            name="changeRequest"
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={changeRequest}
            onChange={(e) => setChangeRequest(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Idea'}
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default IdeaPageContent;
