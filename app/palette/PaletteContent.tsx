'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
        .select('colors')
        .eq('id', ideaId)
        .single();

      if (fetchError) {
        setError('Error fetching colors');
        setIsLoading(false);
        return;
      }

      if (data.colors) {
        setPalette(data.colors);
      }

      setIsLoading(false);
    };

    fetchPalette();
  }, [ideaId]);

  const generateNewPalette = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/generate-palette?id=${ideaId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate colors');
      }

      const result = await response.json();
      setPalette(result.colors);
    } catch (apiError) {
      setError('Error generating colors');
    }
    setIsLoading(false);
  }, [ideaId]);

  if (isLoading) {
    return <div className="text-center" aria-live="polite" role="status">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500" role="alert">Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4" id="palette-heading">Color Palette:</h2>
      {palette.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4" aria-labelledby="palette-heading">
          {palette.map((color, index) => {
            const [hexCode, name, description] = color.split(':').map(item => item.trim());
            return (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-24 h-24"
                  style={{ backgroundColor: hexCode }}
                  aria-label={`Color swatch: ${name}, Hex code: ${hexCode}`}
                  role="img"
                ></div>
                <dl className="mt-2 text-center">
                  <dt className="sr-only">Hex Code</dt>
                  <dd className="font-bold">{hexCode}</dd>
                  <dt className="sr-only">Color Name</dt>
                  <dd className="text-sm">{name}</dd>
                  <dt className="sr-only">Description</dt>
                  <dd className="text-xs mt-1">{description}</dd>
                </dl>
                <button
                  onClick={() => navigator.clipboard.writeText(hexCode)}
                  className="mt-1 text-xs text-blue-600 hover:text-blue-800"
                  aria-label={`Copy ${hexCode} to clipboard`}
                >
                  Copy Hex
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 italic mb-4">No color palette generated yet.</p>
      )}
      <button
        onClick={generateNewPalette}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={isLoading}
        aria-busy={isLoading}
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
