'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";
import { Anthropic } from '@anthropic-ai/sdk';

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
        .select('generated_idea')
        .eq('id', ideaId)
        .single();

      if (fetchError) {
        setError('Error fetching idea');
        setIsLoading(false);
        return;
      }

      setIdea(data.generated_idea);

      // Generate keywords using Anthropic API
      try {
        const anthropic = new Anthropic({
          apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
        });

        const completion = await anthropic.completions.create({
          model: "claude-2",
          max_tokens_to_sample: 300,
          prompt: `Given the following business idea, provide exactly 5 adjectives that best describe it. Separate the adjectives with commas:

          ${data.generated_idea}

          5 adjectives:`,
        });

        const generatedAdjectives = completion.completion.trim().split(',').map(adj => adj.trim());
        setAdjectives(generatedAdjectives);

        // Save adjectives to the database
        const { error: updateError } = await supabase
          .from('ideas')
          .update({ adjectives: generatedAdjectives })
          .eq('id', ideaId);

        if (updateError) {
          setError('Error saving adjectives');
        }
      } catch (apiError) {
        setError('Error generating adjectives');
      }

      setIsLoading(false);
    };

    fetchIdeaAndGenerateKeywords();
  }, [searchParams]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Keywords for Your Idea</h1>
      <p className="mb-4"><strong>Original Idea:</strong> {idea}</p>
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
