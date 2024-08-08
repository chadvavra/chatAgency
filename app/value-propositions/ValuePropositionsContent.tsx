'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";
import LeftNavigation from '@/components/LeftNavigation';
import { FaCopy } from 'react-icons/fa';

interface Idea {
  id: string;
  original_idea: string;
  generated_idea: string;
  value_propositions: string[];
}

export default function ValuePropositionsContent() {
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValueProps, setEditedValueProps] = useState<string[]>([]);
  const [updateRequest, setUpdateRequest] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

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
        setEditedValueProps(data.value_propositions || []);
      }
      setIsLoading(false);
    };

    fetchIdea();
  }, [searchParams]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!idea) return;

    try {
      const response = await fetch('/api/generate-value-propositions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          idea: idea.generated_idea,
          changeRequest: updateRequest 
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.valuePropositions) {
        const supabase = createClient();
        const { error } = await supabase
          .from('ideas')
          .update({ value_propositions: data.valuePropositions })
          .eq('id', idea.id);

        if (error) {
          throw new Error(`Failed to update value propositions: ${error.message}`);
        }

        setIdea({ ...idea, value_propositions: data.valuePropositions });
        setIsEditing(false);
        setUpdateRequest('');
      } else {
        throw new Error('No value propositions generated');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedValueProps(idea?.value_propositions || []);
    setUpdateRequest('');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-semibold text-red-600">Idea not found</h2>
      </div>
    );
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
      <div className="flex">
        <div className="w-1/4 mr-8">
          <LeftNavigation ideaId={idea.id} />
        </div>
        <div className="w-3/4">
          <h1 className="text-2xl font-bold mb-6">Value Propositions</h1>
          <section>
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              Original Idea
              <button 
                onClick={() => copyToClipboard(idea.original_idea)}
                className="ml-2 text-gray-500 hover:text-gray-700"
                title="Copy to clipboard"
              >
                <FaCopy />
              </button>
            </h2>
            <p className="text-gray-700 bg-gray-100 p-4 rounded-md">{idea.original_idea}</p>
          </section>
          <section className="mt-6">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              Value Propositions
              {!isEditing && (
                <button 
                  onClick={() => copyToClipboard(idea.value_propositions.join('\n'))}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  title="Copy to clipboard"
                >
                  <FaCopy />
                </button>
              )}
            </h2>
            {isEditing ? (
              <div>
                <textarea
                  className="w-full h-64 p-2 border rounded-md"
                  value={editedValueProps.join('\n')}
                  onChange={(e) => setEditedValueProps(e.target.value.split('\n'))}
                />
                <div className="mt-2">
                  <label htmlFor="updateRequest" className="block text-sm font-medium text-gray-700">
                    Update Request:
                  </label>
                  <textarea
                    id="updateRequest"
                    className="w-full h-32 p-2 border rounded-md mt-1"
                    value={updateRequest}
                    onChange={(e) => setUpdateRequest(e.target.value)}
                    placeholder="Describe how you want to update or improve the value propositions..."
                  />
                </div>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Update Value Propositions
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <ul className="list-disc pl-5 space-y-2 bg-gray-100 p-4 rounded-md">
                  {idea.value_propositions.map((vp, index) => (
                    <li key={index} className="text-gray-700">{vp}</li>
                  ))}
                </ul>
                <button
                  onClick={handleEdit}
                  className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
