import React from 'react';
import Link from 'next/link';

interface LeftNavigationProps {
  ideaId: string;
}

const LeftNavigation: React.FC<LeftNavigationProps> = ({ ideaId }) => {
  return (
    <nav className="bg-gray-100 p-4 rounded-lg" aria-label="Left Navigation">
      <ul className="space-y-2" role="list">
        <li>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Back
          </Link>
        </li>
        {/* <li>
          <Link href={`/personas?id=${ideaId}`} className="text-blue-600 hover:underline">
            Personas
          </Link>
        </li> */}
        <li>
          <Link href={`/keywords?id=${ideaId}`} className="text-blue-600 hover:underline">
            Keywords
          </Link>
        </li>
        <li>
          <Link href={`/competitors?id=${ideaId}`} className="text-blue-600 hover:underline">
            Competitors
          </Link>
        </li>
        <li>
          <Link href={`/palette?id=${ideaId}`} className="text-blue-600 hover:underline">
            Color Palette
          </Link>
        </li>
        <li>
          <Link href={`/image-generation?id=${ideaId}`} className="text-blue-600 hover:underline">
            Product Image (beta)
          </Link>
        </li>
        <li>
          <Link href="/web-search" className="text-blue-600 hover:underline">
            Web Search
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default LeftNavigation;
