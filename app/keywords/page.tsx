'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";

const KeywordsPage = () => {
  const [idea, setIdea] = useState<string | null>(null);
  const [adjectives, setAdjectives] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchIdeaAndGenerateKeywords = async () => {
      const ideaId = searchParams.get('id');
      if (!ideaId) {
        setError('No idea ID provided');
        setIsLoading(false);
        return;
      }

      const supabase = createClient();
      
      // Fetch the idea
      const { data, error: fetchError } = await supabase
        .from('ideas')
        .select('generated_idea, adjectives')
        .eq('id', ideaId)
        .single();

      if (fetchError) {
        setError('Error fetching idea');
        setIsLoading(false);
        return;
      }

      setIdea(data.generated_idea);

      if (data.adjectives && data.adjectives.length > 0) {
        setAdjectives(data.adjectives);
        setIsLoading(false);
      } else {
        // Generate keywords using the new API route
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
      }

      setIsLoading(false);
    };

    fetchIdeaAndGenerateKeywords();
  }, [searchParams]);

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
      <h2 className="text-xl font-semibold mb-2">Generated Adjectives:</h2>
      <ul className="list-disc pl-5">
        {adjectives.length > 0 ? (
          adjectives.map((adj, index) => (
            <li key={index}>{adj}</li>
          ))
        ) : (
          <li>No adjectives generated yet.</li>
        )}
      </ul>
    </div>
  );
};

export default KeywordsPage;
