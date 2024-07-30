'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";

interface Idea {
  id: string;
  original_idea: string;
  generated_idea: string;
  value_propositions: string[];
}

export default function SavedIdeaPage() {
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchIdea = async () => {
      const ideaId = searchParams.get('id');
      if (!ideaId) {
        setIsLoading(false);
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('id', ideaId)
        .single();

      if (error) {
        console.error('Error fetching idea:', error);
      } else {
        setIdea(data);
      }
      setIsLoading(false);
    };

    fetchIdea();
  }, [searchParams]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!idea) {
    return <div className="container mx-auto px-4 py-8">Idea not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Saved Idea</h1>
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">Original Idea:</h2>
          <p className="text-gray-700 bg-gray-100 p-4 rounded-md">{idea.original_idea}</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Generated Idea:</h2>
          <p className="text-gray-700 bg-gray-100 p-4 rounded-md">{idea.generated_idea}</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Value Propositions:</h2>
          <ul className="list-disc pl-5 space-y-2">
            {idea.value_propositions.map((vp, index) => (
              <li key={index} className="text-gray-700">{vp}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
