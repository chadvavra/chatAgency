'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";

interface PaletteContentProps {
  ideaId: string;
}

const PaletteContent: React.FC<PaletteContentProps> = ({ ideaId }) => {
  const [palette, setPalette] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPalette = async () => {
      if (!ideaId) {
        setError('No idea ID provided');
        setIsLoading(false);
        return;
      }

      const supabase = createClient();
      
      const { data, error: fetchError } = await supabase
        .from('ideas')
        .select('color_palette')
        .eq('id', ideaId)
        .single();

      if (fetchError) {
        setError('Error fetching color palette');
        setIsLoading(false);
        return;
      }

      if (data.color_palette) {
        setPalette(data.color_palette);
      }

      setIsLoading(false);
    };

    fetchPalette();
  }, [ideaId]);

  const generateNewPalette = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/generate-palette?id=${ideaId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate color palette');
      }

      const result = await response.json();
      setPalette(result.palette);
    } catch (apiError) {
      setError('Error generating color palette');
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Color Palette:</h2>
      {palette.length > 0 ? (
        <div className="flex flex-wrap gap-4 mb-4">
          {palette.map((color, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="w-20 h-20 rounded-full"
                style={{ backgroundColor: color }}
              ></div>
              <span className="mt-2">{color}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic mb-4">No color palette generated yet.</p>
      )}
      <button
        onClick={generateNewPalette}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={isLoading}
      >
        {palette.length > 0 ? 'Generate New Palette' : 'Generate Palette'}
      </button>
      <button
        onClick={() => router.back()}
        className="mt-4 ml-4 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
      >
        Back
      </button>
    </div>
  );
};

export default PaletteContent;
