'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient, saveIdea } from "@/utils/supabase/client";

const ValuePropositionsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const router = useRouter();
  const [idea, setIdea] = useState('');
  const [originalIdea, setOriginalIdea] = useState('');
  const [valuePropositions, setValuePropositions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ideaSaved, setIdeaSaved] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    const urlIdea = searchParams.get('generatedIdea');
    const urlOriginalIdea = searchParams.get('originalIdea');

    console.log('URL params:', { urlIdea, urlOriginalIdea });

    if (urlIdea) {
      setIdea(decodeURIComponent(urlIdea));
    }
    if (urlOriginalIdea) {
      setOriginalIdea(decodeURIComponent(urlOriginalIdea));
    }

    const fetchIdea = async () => {
      if (urlIdea) {
        await generateValuePropositions(decodeURIComponent(urlIdea));
      } else if (idea) {
        await generateValuePropositions(idea);
      } else {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('ideas')
            .select('original_idea, generated_idea')
            .eq('user_id', user.id)
            .single();
          
          console.log('Fetched from Supabase:', data);
          
          if (data) {
            setIdea(data.generated_idea || '');
            setOriginalIdea(data.original_idea || '');
            await generateValuePropositions(data.generated_idea || '');
          }
        }
      }
    };

    fetchIdea();
  }, [searchParams, idea]);

  const handleBeforeUnload = useCallback((event: BeforeUnloadEvent) => {
    if (isModified && !ideaSaved) {
      event.preventDefault();
      event.returnValue = '';
    }
  }, [isModified, ideaSaved]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  console.log('Current state:', { idea, originalIdea, valuePropositions });

  const generateValuePropositions = async (ideaText: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-value-propositions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea: ideaText }),
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}. Please try again later.`);
      }
      
      const data = await response.json();
      
      if (data.valuePropositions) {
        setValuePropositions(data.valuePropositions);
        setShowSaveButton(true);
        setIsModified(true);
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

  const handleSaveIdea = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('Saving idea with:', {
          userId: user.id,
          originalIdea,
          idea,
          valuePropositions
        });
        await saveIdea(user.id, originalIdea, idea, valuePropositions);
        setIdeaSaved(true);
        setIsModified(false);
        alert('Idea saved successfully!');
      } else {
        alert('You must be logged in to save ideas.');
      }
    } catch (error) {
      console.error('Error saving idea:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Failed to save idea: ${errorMessage}`);
    }
  };

  const handleDiscard = () => {
    setIsModified(false);
    router.push('/');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Value Propositions</h1>
      
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Original Idea:</h2>
        {originalIdea ? (
          <p className="text-gray-700 whitespace-pre-wrap bg-gray-100 p-4 rounded-md">{originalIdea}</p>
        ) : (
          <p className="text-gray-500 italic">No original idea available</p>
        )}
      </section>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Generated Idea:</h2>
          <p className="text-gray-700 whitespace-pre-wrap bg-gray-100 p-4 rounded-md">{idea}</p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Value Propositions:</h2>
          {isLoading ? (
            <p>Loading value propositions...</p>
          ) : (
            <>
              <ul className="list-disc pl-5 space-y-2">
                {valuePropositions.map((vp, index) => (
                  <li key={index} className="text-gray-700">{vp}</li>
                ))}
              </ul>
              {showSaveButton && !ideaSaved && (
                <div className="mt-4 space-x-4">
                  <button
                    onClick={handleSaveIdea}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Save Idea
                  </button>
                  <button
                    onClick={handleDiscard}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Start Over
                  </button>
                </div>
              )}
              {ideaSaved && (
                router.push(`/saved-idea?id=${idea.id}`)
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default ValuePropositionsContent;
