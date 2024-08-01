'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ImageGenerationContentProps {
  ideaId: string;
}

const ImageGenerationContent: React.FC<ImageGenerationContentProps> = ({ ideaId }) => {
  const [generatedImageUrls, setGeneratedImageUrls] = useState<string[]>([]);
  const [originalIdea, setOriginalIdea] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkExistingImages = async () => {
      try {
        const response = await fetch(`/api/generate-image?id=${ideaId}`);
        const data = await response.json();
        if (data.imageUrls) {
          setGeneratedImageUrls(data.imageUrls);
        }
        if (data.originalIdea) {
          setOriginalIdea(data.originalIdea);
        }
      } catch (err) {
        console.error('Error checking existing images:', err);
      }
    };

    checkExistingImages();
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
      
      if (!data.imageUrls || data.imageUrls.length === 0) {
        throw new Error('No image URLs in the response');
      }
      
      setGeneratedImageUrls(data.imageUrls);
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
          {isLoading ? 'Generating...' : (generatedImageUrls.length > 0 ? 'Generate Another Image' : 'Generate Image')}
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

        {generatedImageUrls.length > 0 && (
          <div>
            <p className="mb-2 text-green-600">Images generated successfully!</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedImageUrls.map((url, index) => (
                <img 
                  key={index} 
                  src={url} 
                  alt={`Generated product ${index + 1}`} 
                  className="max-w-full h-auto rounded shadow-lg cursor-pointer" 
                  onClick={() => setSelectedImage(url)}
                />
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => router.back()}
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          Back
        </button>
      </div>
    </section>,
    {selectedImage && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={() => setSelectedImage(null)}
      >
        <div className="relative">
          <img 
            src={selectedImage} 
            alt="Enlarged product" 
            className="max-w-full max-h-[90vh] rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button 
            className="absolute top-2 right-2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
        </div>
      </div>
    )}
  );
};

export default ImageGenerationContent;
