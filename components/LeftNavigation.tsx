import React from 'react';
import Link from 'next/link';

interface LeftNavigationProps {
  ideaId: string;
}

const LeftNavigation: React.FC<LeftNavigationProps> = ({ ideaId }) => {
  return (
    <nav className="bg-gray-100 p-4 rounded-lg">
      <ul className="space-y-2">
        <li>
          <Link href={`/saved-idea?id=${ideaId}`} className="text-blue-600 hover:underline">
            Idea Details
          </Link>
        </li>
        <li>
          <Link href={`/personas?id=${ideaId}`} className="text-blue-600 hover:underline">
            Personas
          </Link>
        </li>
        <li>
          <Link href={`/keywords?id=${ideaId}`} className="text-blue-600 hover:underline">
            Keywords
          </Link>
        </li>
        <li>
          <Link href={`/product-image?id=${ideaId}`} className="text-blue-600 hover:underline">
            Product Image
          </Link>
        </li>
        <li>
          <Link href={`/color-palette?id=${ideaId}`} className="text-blue-600 hover:underline">
            Color Palette
          </Link>
        </li>
        <li>
          <Link href={`/image-generation?id=${ideaId}`} className="text-blue-600 hover:underline">
            Generate Image
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default LeftNavigation;