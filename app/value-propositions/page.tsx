'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ValuePropositionsPage() {
  const searchParams = useSearchParams();
  const [idea, setIdea] = useState('');
  const [valuePropositions, setValuePropositions] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchedIdea = searchParams.get('idea') || '';
    setIdea(fetchedIdea);
    generateValuePropositions(fetchedIdea);
  }, [searchParams]);

  const generateValuePropositions = async (ideaText: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea: ideaText,
          changeRequest: "describe core value propositions and what can makes its offering valuable and distinct from similar businesses. Identify the unique benefits and features that will appeal to the target",
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}. Please try again later.`);
      }
      
      const data = await response.json();
      
      if (data.generatedIdea) {
        setValuePropositions(data.generatedIdea);
      } else {
        throw new Error('No value propositions generated');
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
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Value Propositions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Original Idea:</h2>
          <p className="text-gray-700 whitespace-pre-wrap bg-gray-100 p-4 rounded-md">{idea}</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Value Propositions:</h2>
          {isLoading ? (
            <p>Loading value propositions...</p>
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap bg-gray-100 p-4 rounded-md">{valuePropositions}</p>
          )}
        </div>
      </div>
    </div>
  );
}
