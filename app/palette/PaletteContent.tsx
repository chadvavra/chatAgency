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

    if (data.colors && data.colors.length > 0) {
      try {
        const colorData = JSON.parse(data.colors[0]);
        if (typeof colorData.hexCode === 'string') {
          const colorPairs = colorData.hexCode.match(/<color>#[A-Fa-f0-9]{6}<\/color>\s*<name>.*?<\/name>/g);
          if (colorPairs) {
            const parsedColors = colorPairs.map((pair: string) => {
              const hexCode = pair.match(/<color>(#[A-Fa-f0-9]{6})<\/color>/)?.[1] || '';
              const name = pair.match(/<name>(.*?)<\/name>/)?.[1] || '';
              return { hexCode, name };
            });
            setPalette(parsedColors);
          } else {
            console.error('No color data found in the expected format');
            setPalette([]);
          }
        } else {
          console.error('Color data is not a string:', colorData);
          setPalette([]);
        }
      } catch (parseError) {
        console.error('Error parsing color data:', parseError);
        setPalette([]);
      }
    } else {
      setPalette([]);
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
    navigator.clipboard.writeText(text).then(() => {
      alert('Color code copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  if (isLoading) {
    return (
      <div className="text-center" aria-live="polite">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Loading color palette...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500" aria-live="assertive">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Color Palette</h2>
        <button
          onClick={generateNewPalette}
          className={`flex items-center space-x-2 ${isLoading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold py-2 px-4 rounded transition duration-300`}
          disabled={isLoading}
          aria-busy={isLoading}
          aria-label={isLoading ? 'Generating color palette' : (palette.length > 0 ? 'Regenerate color palette' : 'Generate color palette')}
        >
          <FaRedo className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
          <span>{isLoading ? 'Generating...' : (palette.length > 0 ? 'Regenerate color palette' : 'Generate color palette')}</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {[...Array(5)].map((_, index) => {
          const color = palette[index] || { hexCode: '#CCCCCC', name: 'Placeholder' };
          return (
            <div key={`color-${index}`} className="flex flex-col">
              <div className="flex flex-col rounded-lg overflow-hidden shadow">
                <div
                  className="h-24"
                  style={{ backgroundColor: color.hexCode }}
                  aria-label={`Color swatch ${index + 1}: ${color.name} (${color.hexCode})`}
                  role="img"
                ></div>
                <div className="bg-white p-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold mb-1">{color.name}</span>
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
              </div>
            </div>
          );
        })}
      </div>
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
