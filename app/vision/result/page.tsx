'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { oswald, plex } from '../../../utils/fonts';

export default function VisionResult() {
  const [visionStatement, setVisionStatement] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [supabase, setSupabase] = useState(null);
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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className={`${plex.className} text-4xl font-bold text-gray-900 mb-8 text-center`}>
          Your Generated Vision
        </h1>
        
        <div className={`${oswald.className} text-lg text-gray-700 space-y-6`}>
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
        </div>
      </div>
    </div>
  );
}
