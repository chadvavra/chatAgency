'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient, saveValueProp } from "@/utils/supabase/client";

const ValuePropositionsContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [idea, setIdea] = useState('');
  const [originalIdea, setOriginalIdea] = useState('');
  const [valuePropositions, setValuePropositions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [valueSaved, setValueSaved] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [ideaId, setIdeaId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (valueSaved) {
      router.push('#');
    }
  }, [valueSaved, router]);

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
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('ideas')
          .select('id, original_idea, generated_idea, value_propositions')
          .eq('user_id', user.id)
          .single();

        console.log('Fetched from Supabase:', data);

        if (data) {
          setIdea(data.generated_idea || '');
          setOriginalIdea(data.original_idea || '');
          setIdeaId(data.id);
          if (data.value_propositions) {
            setValuePropositions(data.value_propositions);
            setShowSaveButton(true);
          } else if (data.generated_idea) {
            await generateValuePropositions(data.generated_idea);
          }
        }
      } else if (urlIdea) {
        await generateValuePropositions(decodeURIComponent(urlIdea));
      } else if (idea) {
        await generateValuePropositions(idea);
      }
    };

    fetchIdea();
    setIsLoading(false);
  }, [searchParams, idea]);

  const handleBeforeUnload = useCallback((event: BeforeUnloadEvent) => {
    if (isModified && !valueSaved) {
      event.preventDefault();
      event.returnValue = '';
    }
  }, [isModified, valueSaved]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  console.log('Current state:', { idea, originalIdea, valuePropositions });

  const generateValuePropositions = async (ideaText: string) => {
    if (!ideaText.trim()) {
      setError("No idea provided. Please enter an idea first.");
      return;
    }
    setIsLoading(true);
    setError(null);
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

      if (data.valuePropositions && Array.isArray(data.valuePropositions)) {
        const parsedValuePropositions = data.valuePropositions
          .filter((vp: string) => vp.trim() !== '')
          .map((vp: string) => vp.trim());

        if (parsedValuePropositions.length > 0) {
          setValuePropositions(parsedValuePropositions);
          setShowSaveButton(true);
          setIsModified(true);
        } else {
          throw new Error('No valid value propositions generated.');
        }
      } else if (data.valuePropositions && typeof data.valuePropositions === 'string') {
        const parsedValuePropositions = data.valuePropositions
          .split('\n')
          .filter((vp: string) => vp.trim() !== '')
          .map((vp: string) => vp.trim());

        if (parsedValuePropositions.length > 0) {
          setValuePropositions(parsedValuePropositions);
          setShowSaveButton(true);
          setIsModified(true);
        } else {
          throw new Error('No valid value propositions generated.');
        }
      } else {
        throw new Error('Invalid value propositions data received.');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(`An error occurred: ${errorMessage}. Please try again.`);
      setValuePropositions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveValueProps = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('Saving idea with:', {
          userId: user.id,
          valuePropositions
        });
        await saveValueProp(user.id, valuePropositions);
        setValueSaved(true);
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

      <div className="space-y-4">
        {/* <h2 className="text-xl font-semibold">Value Propositions</h2> */}
          {isLoading ? (
            <p>Loading value propositions...</p>
          ) : error ? (
            <div>
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => generateValuePropositions(idea)}
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Retry
              </button>
            </div>
          ) : valuePropositions.length > 0 ? (
            <>
              <ul className="list-disc pl-5 space-y-2">
                {valuePropositions.map((vp, index) => (
                  <li key={index} className="text-gray-700">{vp}</li>
                ))}
              </ul>
              <div className="mt-4 space-x-4">
                <button
                  onClick={() => generateValuePropositions(idea)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Generate New Value Propositions
                </button>
                {showSaveButton && !valueSaved && (
                  <>
                    <button
                      onClick={handleSaveValueProps}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleDiscard}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Discard
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <p>No value propositions generated yet.</p>
          )}
      </div>
    </div>
  );
}

export default ValuePropositionsContent;
