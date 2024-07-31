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
      const response = await fetch(`/api/generate-image?id=${ideaId}`);
      if (!response.ok) {
        throw new Error('Failed to generate image');
      }
      const data = await response.json();
      setGeneratedImageUrl(data.imageUrl);
    } catch (err) {
      setError('An error occurred while generating the image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleGenerateImage}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {isLoading ? 'Generating...' : 'Generate Image'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {generatedImageUrl && (
        <div className="mt-4">
          <img src={generatedImageUrl} alt="Generated Image" className="max-w-full h-auto" />
        </div>
      )}

      <button
        onClick={() => router.back()}
        className="mt-4 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
      >
        Back
      </button>
    </div>
  );
};

export default ImageGenerationContent;
