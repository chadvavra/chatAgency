'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import IdeaForm from '@/components/IdeaForm';
import { FaTrash } from 'react-icons/fa';

interface Idea {
  id: string;
  original_idea: string;
  created_at: string;
  image_urls?: string[];
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('cards');
  const router = useRouter();
  const supabase = createClient();

  const fetchUserAndIdeas = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        const { data, error } = await supabase
          .from('ideas')
          .select('id, original_idea, created_at, image_urls')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

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

  useEffect(() => {
    fetchUserAndIdeas();
  }, []);

  const deleteIdea = async (ideaId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this idea?');
    if (confirmDelete) {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', ideaId);

      if (error) {
        console.error('Error deleting idea:', error);
        alert('Failed to delete idea. Please try again.');
      } else {
        fetchUserAndIdeas(); // Reload the dashboard
      }
    }
  };

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
            <div key={idea.id} className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 relative">
              <Link href={`/saved-idea?id=${idea.id}`}>
                <div>
                  {idea.image_urls && idea.image_urls.length > 0 && (
                    <div className="mb-4">
                      <Image
                        src={idea.image_urls[idea.image_urls.length - 1]}
                        alt={`Thumbnail for ${idea.original_idea}`}
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}
                  <p className="text-gray-600">{idea.original_idea}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Created: {new Date(idea.created_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                  </p>
                </div>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  deleteIdea(idea.id);
                }}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                aria-label="Delete idea"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <ul className="space-y-4">
          {ideas.map((idea) => (
            <li key={idea.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 relative">
              <Link href={`/saved-idea?id=${idea.id}`} className="flex justify-between items-center">
                <div className="flex items-center">
                  {idea.image_urls && idea.image_urls.length > 0 && (
                    <div className="mr-4">
                      <Image
                        src={idea.image_urls[idea.image_urls.length - 1]}
                        alt={`Thumbnail for ${idea.original_idea}`}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}
                  <p className="text-gray-600">{idea.original_idea}</p>
                </div>
                <p className="text-sm text-gray-400">
                  Created: {new Date(idea.created_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                </p>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  deleteIdea(idea.id);
                }}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                aria-label="Delete idea"
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Generate New Idea</h2>
        <IdeaForm user={user} />
      </section>
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
