'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ImageGenerationContentProps {
  ideaId: string;
}

const ImageGenerationContent: React.FC<ImageGenerationContentProps> = ({ ideaId }) => {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [originalIdea, setOriginalIdea] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkExistingImage = async () => {
      try {
        const response = await fetch(`/api/generate-image?id=${ideaId}`);
        const data = await response.json();
        if (data.imageUrl) {
          setGeneratedImageUrl(data.imageUrl);
        }
        if (data.originalIdea) {
          setOriginalIdea(data.originalIdea);
        }
      } catch (err) {
        console.error('Error checking existing image:', err);
      }
    };

    checkExistingImage();
  }, [ideaId]);

  const handleGenerateImage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching image with ideaId:', ideaId);
      const response = await fetch(`/api/generate-image?id=${ideaId}&regenerate=true`, {
        method: 'POST',
      });
      console.log('Response status:', response.status);
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      console.log('Parsed response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }
      
      if (!data.imageUrl) {
        throw new Error('No image URL in the response');
      }
      
      setGeneratedImageUrl(data.imageUrl);
    } catch (err) {
      console.error('Error in handleGenerateImage:', err);
      setError(`An error occurred while generating the image: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section aria-labelledby="image-generation-heading">
      <h2 id="image-generation-heading" className="sr-only">Image Generation</h2>
      {originalIdea && (
        <p className="mb-4 text-lg font-semibold">Original Idea: {originalIdea}</p>
      )}
      <div className="space-y-4">
        <button
          onClick={handleGenerateImage}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          aria-busy={isLoading}
        >
          {isLoading ? 'Generating...' : (generatedImageUrl ? 'Regenerate Image' : 'Generate Image')}
        </button>

        {error && <p role="alert" className="text-red-500">{error}</p>}

        {isLoading && (
          <div className="text-center" aria-live="polite">
            <p className="mb-2">Generating image, please wait...</p>
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}

        {generatedImageUrl && (
          <div>
            <p className="mb-2 text-green-600">Image generated successfully!</p>
            <img src={generatedImageUrl} alt="Generated product" className="max-w-full h-auto rounded shadow-lg" />
          </div>
        )}

        <button
          onClick={() => router.back()}
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          Back
        </button>
      </div>
    </section>
  );
};

export default ImageGenerationContent;
