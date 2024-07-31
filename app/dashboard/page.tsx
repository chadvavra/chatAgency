'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 

interface Idea {
  id: string;
  original_idea: string;
  created_at: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const fetchUserAndIdeas = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        const { data, error } = await supabase
          .from('ideas')
          .select('id, original_idea, created_at')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching ideas:', error);
        } else {
          setIdeas(data || []);
        }
      } else {
        router.push('/login');
      }

      setIsLoading(false);
    };

    fetchUserAndIdeas();
  }, [router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null; // This will prevent any flash of content before redirect
  }

  const renderIdeas = () => {
    if (viewMode === 'cards') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <Link href={`/saved-idea?id=${idea.id}`} key={idea.id}>
              <div className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200">
                <p className="text-gray-600">{idea.original_idea}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Created: {new Date(idea.created_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      );
    } else {
      return (
        <ul className="space-y-4">
          {ideas.map((idea) => (
            <li key={idea.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
              <Link href={`/saved-idea?id=${idea.id}`} className="flex justify-between items-center">
                <p className="text-gray-600">{idea.original_idea}</p>
                <p className="text-sm text-gray-400">
                  Created: {new Date(idea.created_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Ideas Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-4 py-2 rounded ${viewMode === 'cards' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Cards
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            List
          </button>
        </div>
      </div>
      {renderIdeas()}
    </div>
  );
}
