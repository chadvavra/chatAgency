'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";

const CompetitorsContent = () => {
  const router = useRouter();
  const [idea, setIdea] = useState<string | null>(null);
  const [competitors, setCompetitors] = useState<string[]>([]);
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
        .select('generated_idea, competitors')
        .eq('id', id)
        .single();

      if (fetchError) {
        setError('Error fetching idea');
        setIsLoading(false);
        return;
      }

      setIdea(data.generated_idea);

      if (data.competitors && data.competitors.length > 0) {
        setCompetitors(data.competitors);
      }

      setIsLoading(false);
    };

    fetchIdea();
  }, [searchParams]);

  const generateNewCompetitors = async () => {
    if (!ideaId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/generate-competitors?id=${ideaId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate competitors');
      }

      const result = await response.json();
      setCompetitors(result.competitors);
    } catch (apiError) {
      setError('Error generating competitors');
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center" role="status" aria-live="polite">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500" role="alert" aria-live="assertive">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Competitors for Your Idea</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mt-4">
        <h2 className="text-xl font-semibold mb-4">Inspiring Competitors:</h2>
        {Array.isArray(competitors) && competitors.length > 0 ? (
          <>
            <ul className="list-disc pl-5 space-y-4 mb-4">
              {competitors.map((comp, index) => (
                <li key={`comp-${index}`} className="text-gray-700">
                  <p className="font-semibold">{comp.split(':')[0]}</p>
                  <p>{comp.split(':')[1]}</p>
                </li>
              ))}
            </ul>
            <button
              onClick={generateNewCompetitors}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate New Competitors'}
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-500 italic mb-4">No competitors generated yet.</p>
            <button
              onClick={generateNewCompetitors}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Competitors'}
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

export default CompetitorsContent;
