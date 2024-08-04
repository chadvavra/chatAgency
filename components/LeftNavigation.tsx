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
            <button onClick={toggleInstructions} className="text-blue-600 hover:underline">
              Instructions
            </button>
          </li>
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
            <ol className="list-decimal list-inside space-y-4">
              <li>
                <strong>Keywords:</strong> Generate and review relevant keywords for your idea. These will help in SEO and understanding your target market.
              </li>
              <li>
                <strong>Color Palette:</strong> Create a color scheme that represents your brand. You can regenerate until you find a palette that fits your vision.
              </li>
              <li>
                <strong>Competitors:</strong> Analyze potential competitors in your market. This will help you understand your unique selling points and market positioning.
              </li>
              <li>
                <strong>Product Image:</strong> Generate a visual representation of your product or service idea. This can help in conceptualizing and presenting your idea.
              </li>
            </ol>
          </div>
        </div>
      )}
    </>
  );
};

export default LeftNavigation;
