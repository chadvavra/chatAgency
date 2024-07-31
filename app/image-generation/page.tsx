import React from 'react';
import ImageGenerationContent from './ImageGenerationContent';

const ImageGenerationPage = ({ searchParams }: { searchParams: { id: string } }) => {
  const { id } = searchParams;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Image Generation</h1>
      <ImageGenerationContent ideaId={id} />
    </div>
  );
};

export default ImageGenerationPage;
