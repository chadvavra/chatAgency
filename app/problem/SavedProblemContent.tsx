'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";
import { FaCopy } from 'react-icons/fa';

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
      const response = await fetch(`/api/generate-problem?id=${ideaId}`, {
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Problem Statement for Your Idea
      {problem && problem.length > 0 && (
        <button 
          onClick={() => copyToClipboard(problem[0])}
          className="ml-2 text-gray-500 hover:text-gray-700"
          title="Copy to clipboard"
        >
          <FaCopy />
        </button>
      )}
      </h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mt-4">
        {problem && problem.length > 0 ? (
          <>
            <div className="mb-4">
              {problem[0].split('\n\n').map((paragraph, index) => (
                <div key={index} className="mb-4">
                  {paragraph.split('\n').map((line, lineIndex) => (
                    <p key={`${index}-${lineIndex}`} className="text-gray-700">
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>
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