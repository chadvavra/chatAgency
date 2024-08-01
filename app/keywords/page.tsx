'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";

const KeywordsPage = () => {
  const router = useRouter();
  const [idea, setIdea] = useState<string | null>(null);
  const [adjectives, setAdjectives] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ideaId, setIdeaId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchIdea = async () => {
      const id = searchParams.get('id');
      if (!id) {
        setError('No idea ID provided');
        setIsLoading(false);
        return;
      }
      setIdeaId(id);

      const supabase = createClient();
      
      // Fetch the idea
      const { data, error: fetchError } = await supabase
        .from('ideas')
        .select('generated_idea, adjectives')
        .eq('id', id)
        .single();

      if (fetchError) {
        setError('Error fetching idea');
        setIsLoading(false);
        return;
      }

      setIdea(data.generated_idea);

      if (data.adjectives && data.adjectives.length > 0) {
        setAdjectives(data.adjectives);
      }

      setIsLoading(false);
    };

    fetchIdea();
  }, [searchParams]);

  const generateNewKeywords = async () => {
    if (!ideaId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/generate-keywords?id=${ideaId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate keywords');
      }

      const result = await response.json();
      setAdjectives(result.adjectives);
    } catch (apiError) {
      setError('Error generating adjectives');
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center" aria-live="polite">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500" aria-live="assertive">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Keywords for Your Idea</h1>
      {/* <p className="mb-4"><strong>Original Idea:</strong> {idea}</p> */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-4">
        <h2 className="text-xl font-semibold mb-4">Generated Adjectives:</h2>
        {adjectives.length > 0 ? (
          <>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              {adjectives.map((adj, index) => (
                <li key={index} className="text-gray-700">{adj}</li>
              ))}
            </ul>
            <button
              onClick={generateNewKeywords}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate New Keywords'}
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-500 italic mb-4">No adjectives generated yet.</p>
            <button
              onClick={generateNewKeywords}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Keywords'}
            </button>
          </>
        )}
      </div>
      <button
        onClick={() => router.back()}
        className="mt-4 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
      >
        Back
      </button>
    </div>
  );
};

export default KeywordsPage;
