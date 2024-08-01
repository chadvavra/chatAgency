import React from 'react';
import PaletteContent from './PaletteContent';

const PalettePage = ({ searchParams }: { searchParams: { id: string } }) => {
  const { id } = searchParams;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Color Palette</h1>
      <PaletteContent ideaId={id} />
    </div>
  );
};

export default PalettePage;
