'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";
import { FaClipboard, FaRedo } from 'react-icons/fa';

interface PaletteContentProps {
  ideaId: string;
}

interface Color {
  hexCode: string;
  name: string;
  description: string;
}

const PaletteContent: React.FC<PaletteContentProps> = ({ ideaId }) => {
  const [palette, setPalette] = useState<Color[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchPalette = useCallback(async () => {
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
      setPalette(data.colors.map((colorData: string) => {
        try {
          return JSON.parse(colorData);
        } catch {
          const [hexCode, name, description] = colorData.split(':').map(item => item.trim());
          return { hexCode, name, description };
        }
      }));
    }

    setIsLoading(false);
  }, [ideaId]);

  useEffect(() => {
    fetchPalette();
  }, [fetchPalette]);

  const generateNewPalette = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/generate-palette?id=${ideaId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate colors');
      }

      await fetchPalette();
    } catch (apiError) {
      setError('Error generating colors');
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) {
    return <div className="text-center" aria-live="polite" role="status">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500" role="alert">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold" id="palette-heading">Color Palette</h2>
        <button
          onClick={generateNewPalette}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          <FaRedo className="w-4 h-4" />
          <span>{palette.length > 0 ? 'Regenerate' : 'Generate'}</span>
        </button>
      </div>
      {palette.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6" aria-labelledby="palette-heading">
          {palette.map((color, index) => (
            <div key={index} className="flex flex-col">
              <div
                className="h-32 rounded-t-lg"
                style={{ backgroundColor: color.hexCode }}
                aria-label={`Color swatch: ${color.name}`}
                role="img"
              ></div>
              <div className="bg-white p-4 rounded-b-lg shadow">
                <h3 className="font-semibold text-lg mb-1">{color.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{color.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-mono">{color.hexCode}</span>
                  <button
                    onClick={() => copyToClipboard(color.hexCode)}
                    className="text-blue-500 hover:text-blue-600 transition duration-300"
                    aria-label={`Copy ${color.hexCode} to clipboard`}
                  >
                    <FaClipboard className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No color palette generated yet.</p>
      )}
      <button
        onClick={() => router.back()}
        className="mt-6 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded transition duration-300"
      >
        Back
      </button>
    </div>
  );
};

export default PaletteContent;
