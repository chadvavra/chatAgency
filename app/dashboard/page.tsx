'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Link from 'next/link';

interface Idea {
  id: string;
  original_idea: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const fetchUserAndIdeas = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        const { data, error } = await supabase
          .from('ideas')
          .select('id, original_idea')
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
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!user) {
    return null; // This will prevent any flash of content before redirect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Ideas Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea) => (
          <Link href={`/saved-idea?id=${idea.id}`} key={idea.id}>
            <div className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <p className="text-gray-600">{idea.original_idea}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
