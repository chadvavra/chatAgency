'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ImageGenerationContentProps {
  ideaId: string;
}

const ImageGenerationContent: React.FC<ImageGenerationContentProps> = ({ ideaId }) => {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerateImage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching image with ideaId:', ideaId);
      const response = await fetch(`/api/generate-image?id=${ideaId}`);
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
      setError(`An error occurred while generating the image: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="space-y-4">
        <button
          onClick={handleGenerateImage}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>

        {error && <p className="text-red-500">{error}</p>}

        {generatedImageUrl && (
          <div>
            <img src={generatedImageUrl} alt="Generated Image" className="max-w-full h-auto rounded shadow-lg" />
          </div>
        )}

        <button
          onClick={() => router.back()}
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ImageGenerationContent;
