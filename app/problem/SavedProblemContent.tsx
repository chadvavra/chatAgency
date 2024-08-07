'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";

const ProblemContent = () => {
  const router = useRouter();
  const [idea, setIdea] = useState<string | null>(null);
  const [problem, setProblem] = useState<string[]>([]);
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
        .select('generated_idea, problem')
        .eq('id', id)
        .single();

      if (fetchError) {
        setError('Error fetching idea');
        setIsLoading(false);
        return;
      }

      setIdea(data.generated_idea);

      if (data.problem && data.problem.length > 0) {
        setProblem(data.problem);
      }

      setIsLoading(false);
    };

    fetchIdea();
  }, [searchParams]);

  const generateNewProblem = async () => {
    if (!ideaId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/generate-keywords?id=${ideaId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate problem statement');
      }

      const result = await response.json();
      setProblem(result.problem);
    } catch (apiError) {
      setError('Error generating Problem Statement');
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
      <h1 className="text-2xl font-bold mb-4">Problem Statement for Your Idea</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mt-4">
        <h2 className="text-xl font-semibold mb-4">Generated Problem:</h2>
        {problem && problem.length > 0 ? (
          <>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              {problem.map((adj, index) => (
                <li key={`adj-${index}`} className="text-gray-700">{adj}</li>
              ))}
            </ul>
            <button
              onClick={generateNewProblem}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate New Problem Statement'}
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-500 italic mb-4">No problem statement generated yet.</p>
            <button
              onClick={generateNewProblem}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Problem Statement'}
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

export default ProblemContent;
