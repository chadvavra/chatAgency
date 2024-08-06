'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function ResultContent() {
  const [visionStatement, setVisionStatement] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    setSupabase(createClient());
    const statement = searchParams.get('statement');
    if (statement) {
      setVisionStatement(decodeURIComponent(statement));
    }
  }, [searchParams]);

  const saveVision = async () => {
    if (supabase && visionStatement) {
      const { data, error } = await supabase
        .from('ideas')
        .insert({ vision: visionStatement })
        .select();

      if (error) {
        console.error('Error saving vision statement to Supabase:', error);
        alert('An error occurred while saving the vision statement. Please try again.');
      } else {
        console.log('Vision statement saved successfully:', data);
        setIsSaved(true);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Vision Statement:</h2>
      <p className="mb-6">{visionStatement}</p>
      
      {!isSaved ? (
        <button 
          onClick={saveVision}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Vision
        </button>
      ) : (
        <p className="text-green-600 font-semibold">Vision saved successfully!</p>
      )}
    </div>
  );
}
