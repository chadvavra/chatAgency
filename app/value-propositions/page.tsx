
import ValuePropositionsContent from './ValuePropositionsContent';

'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient, saveIdea } from "@/utils/supabase/client";

export default function ValuePropositionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [generatedIdea, setGeneratedIdea] = useState('');
  const [originalIdea, setOriginalIdea] = useState('');
  const [valuePropositions, setValuePropositions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const idea = searchParams.get('generatedIdea');
    const original = searchParams.get('originalIdea');
    if (idea) {
      setGeneratedIdea(decodeURIComponent(idea));
    }
    if (original) {
      setOriginalIdea(decodeURIComponent(original));
    }
    if (idea) {
      generateValuePropositions(decodeURIComponent(idea));
    }
  }, [searchParams]);

  const generateValuePropositions = async (idea: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-value-propositions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea }),
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}. Please try again later.`);
      }
      
      const data = await response.json();
      
      if (data.valuePropositions) {
        setValuePropositions(data.valuePropositions);
      } else {
        throw new Error('No value propositions generated');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`An error occurred while generating value propositions. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        await saveIdea(user.id, originalIdea, generatedIdea, valuePropositions);
        alert('Idea saved successfully!');
        router.push('/dashboard');
      } catch (error) {
        console.error('Error saving idea:', error);
        alert('Failed to save the idea. Please try again.');
      }
    } else {
      alert('You must be logged in to save ideas.');
      router.push('/login');
    }
    setIsSaving(false);
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (valuePropositions.length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [valuePropositions]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Generated Idea:</h2>
        <p className="text-gray-700 whitespace-pre-wrap bg-gray-100 p-4 rounded-md">{generatedIdea}</p>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Value Propositions:</h2>
        {isLoading ? (
          <p>Generating value propositions...</p>
        ) : (
          <ul className="list-disc pl-5 space-y-2">
            {valuePropositions.map((vp, index) => (
              <li key={index} className="text-gray-700">{vp}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading || isSaving || valuePropositions.length === 0}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Idea'}
        </button>
      </div>
    </div>
  );
}
