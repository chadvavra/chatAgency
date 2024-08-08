'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient, getIdea, saveIdea } from "@/utils/supabase/client";

interface Idea {
  id: string;
  original_idea: string;
  generated_idea: string;
  value_propositions: string[];
}
export default function IdeaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [originalIdea, setOriginalIdea] = useState('');
  const [idea, setIdea] = useState('');
  // const [idea, setIdea] = useState<Idea | null>(null);
  const [generatedIdea, setGeneratedIdea] = useState('');
  const [changeRequest, setChangeRequest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ideaSaved, setIdeaSaved] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    const urlIdea = searchParams.get('generatedIdea');
    const original = searchParams.get('originalIdea');
    const urlOriginalIdea = searchParams.get('originalIdea');
    if (urlIdea) {
      setIdea(decodeURIComponent(urlIdea));
    }
    if (urlOriginalIdea) {
      setOriginalIdea(decodeURIComponent(urlOriginalIdea));
    }

    // if (idea) {
    //   console.log('Received generated idea:', decodeURIComponent(idea));
    //   setGeneratedIdea(decodeURIComponent(idea));
    // }
    // if (original) {
    //   console.log('Received original idea:', decodeURIComponent(original));
    //   // You might want to store this original idea in state if needed
    // }
  }, [searchParams]);

  const handleChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea: generatedIdea, changeRequest }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}. Please try again later.`);
      }

      const data = await response.json();

      if (data.generatedIdea) {
        setGeneratedIdea(data.generatedIdea);
        setChangeRequest('');
      } else {
        throw new Error('No idea generated');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`An error occurred: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const originalIdeaParam = searchParams.get('originalIdea');
        const originalIdeaEncoded = originalIdeaParam ? encodeURIComponent(originalIdeaParam) : '';
        router.push(`/value-propositions?generatedIdea=${encodeURIComponent(generatedIdea)}&originalIdea=${originalIdeaEncoded}`);
      } else {
        alert('You must be logged in to continue.');
        router.push('/login');
      }
    });
  };

  const handleSaveIdea = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('Saving idea with:', {
          userId: user.id,
          originalIdea,
          idea
        });
        await saveIdea(user.id, originalIdea, idea);
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
    router.push('/dashboard');
  };

  useEffect(() => {
    if (ideaSaved) {
      router.push('/dashboard');
    }
  }, [ideaSaved, router]);

  useEffect(() => {
    const loadIdea = async () => {
      const idea = searchParams.get('generatedIdea');
      if (idea) {
        console.log('Received generated idea from URL:', decodeURIComponent(idea));
        setGeneratedIdea(decodeURIComponent(idea));
      } else {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          try {
            const existingIdea = await getIdea(user.id);
            if (existingIdea && existingIdea.generated_idea) {
              console.log('Loaded existing idea from Supabase:', existingIdea.generated_idea);
              setGeneratedIdea(existingIdea.generated_idea);
            }
          } catch (error) {
            console.error('Error loading existing idea:', error);
          }
        }
      }
    };

    loadIdea();
  }, [searchParams]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Original Idea:</h2>
        {originalIdea ? (
          <p className="text-gray-700 whitespace-pre-wrap bg-gray-100 p-4 rounded-md">{originalIdea}</p>
        ) : (
          <p className="text-gray-500 italic">No original idea available</p>
        )}
      </section>
      <div>
        <h2 className="text-lg font-semibold mb-2">Generated Idea:</h2>
        <div className="text-gray-700 bg-gray-100 p-4 rounded-md">
          {generatedIdea.includes('<Business Overview>') && (
            <>
              <h3 className="font-semibold mb-2">Business Overview</h3>
              <p className="whitespace-pre-wrap mb-4">{generatedIdea.match(/<Business Overview>([\s\S]*?)<\/Business Overview>/)?.[1]}</p>
            </>
          )}

          {generatedIdea.includes('<Target Markets>') && (
            <>
              <h3 className="font-semibold mb-2">Target Markets</h3>
              <ul className="list-disc list-inside mb-4">
                {generatedIdea.match(/<Target Markets>([\s\S]*?)<\/Target Markets>/)?.[1].split('\n').filter(Boolean).map((market, index) => (
                  <li key={index}>{market.trim().replace(/^-\s*/, '')}</li>
                ))}
              </ul>
            </>
          )}

          {generatedIdea.includes('<Key Features>') && (
            <>
              <h3 className="font-semibold mb-2">Key Features</h3>
              <ul className="list-disc list-inside mb-4">
                {generatedIdea.match(/<Key Features>([\s\S]*?)<\/Key Features>/)?.[1].split('\n').filter(Boolean).map((feature, index) => (
                  <li key={index}>{feature.trim().replace(/^-\s*/, '')}</li>
                ))}
              </ul>
            </>
          )}

          {generatedIdea.includes('<Challenges>') && (
            <>
              <h3 className="font-semibold mb-2">Challenges</h3>
              <ul className="list-disc list-inside mb-4">
                {generatedIdea.match(/<Challenges>([\s\S]*?)<\/Challenges>/)?.[1].split('\n').filter(Boolean).map((challenge, index) => (
                  <li key={index}>{challenge.trim().replace(/^-\s*/, '')}</li>
                ))}
              </ul>
            </>
          )}

          {generatedIdea.includes('<Summary>') && (
            <>
              <h3 className="font-semibold mb-2">Summary</h3>
              <p className="whitespace-pre-wrap">{generatedIdea.match(/<Summary>([\s\S]*?)<\/Summary>/)?.[1]}</p>
            </>
          )}
        </div>
      </div>
      <form onSubmit={handleChangeRequest} className="space-y-4">
        <div>
          <label
            htmlFor="changeRequest"
            className="block text-sm font-medium text-gray-700"
          >
            Request Changes or Improvements
          </label>
          <textarea
            id="changeRequest"
            name="changeRequest"
            rows={4}
            className="mt-1 block w-full p-4 rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={changeRequest}
            onChange={(e) => setChangeRequest(e.target.value)}
            optional
          />
        </div>
        <div className="mt-4 space-x-4">

          {/* <button
            type="button"
            onClick={handleContinue}
            className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Continue
          </button> */}
          <>

            {/* {showSaveButton && !ideaSaved && ( */}
            <div className="mt-4 space-x-4">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Idea'}
              </button>
              <button
                onClick={handleSaveIdea}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
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
            {/* )} */}
          </>
        </div>
      </form>
    </div>
  );
}
