"use client";
import React, { useState } from 'react';
import Link from 'next/link';

interface LeftNavigationProps {
  ideaId: string;
}

const LeftNavigation: React.FC<LeftNavigationProps> = ({ ideaId }) => {
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  const toggleInstructions = () => {
    setIsInstructionsOpen(!isInstructionsOpen);
  };

  return (
    <>
      <nav className="bg-gray-100 p-4 rounded-lg" aria-label="Left Navigation">
        <ul className="space-y-2" role="list">
          <li>
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              Back
            </Link>
          </li>
          <li>
            <button onClick={toggleInstructions} className="text-blue-600 hover:underline">
              Instructions
            </button>
          </li>
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
            <Link href={`/revenue-streams?id=${ideaId}`} className="text-blue-600 hover:underline">
              Revenue Streams
            </Link>
          </li>
          {/* <li>
            <Link href={`/vision?id=${ideaId}`} className="text-blue-600 hover:underline">
              Vision
            </Link>
          </li> */}
        </ul>
      </nav>

      {isInstructionsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={toggleInstructions}>
          <div className="bg-white p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={toggleInstructions} className="float-right text-gray-600 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-4">Instructions</h2>
            <ul className="list-decimal list-outside p-4 space-y-4">
              <li>
                <strong>Saved Idea:</strong>The Saved Idea page displays the detailed idea and value propositions for your idea. Includes a feature to request updates to the idea. Value propositions will be updated automatically.
              </li>
              <li>
                <strong>Keywords:</strong> Generate and review relevant keywords for your idea. These will help in SEO and understanding your target market.
              </li>
              <li>
                <strong>Color Palette:</strong> Create a color scheme that represents your brand. You can regenerate until you find a palette that fits your vision. Only one color palette is saved. (Requires generated Keywords).
              </li>
              <li>
                <strong>Competitors:</strong> Uses the generated description to automatically search the web and analyzes potential competitors in your market. This will help you understand your unique selling points and market positioning.  Multiple searches can result in different competitors.
              </li>
              <li>
                <strong>Product Image:</strong> Uses the entire Detailed description to generate a visual representations of your product or service idea. This can help in conceptualizing and presenting your idea.  All generated images are saved automatically.
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default LeftNavigation;
