import dynamic from 'next/dynamic';
const ResultContent = dynamic(() => import('./resultContent'), { ssr: false });

import { oswald, plex } from '../../../utils/fonts';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className={`${plex.className} text-4xl font-bold text-gray-900 mb-8 text-center`}>
          Your Generated Vision
        </h1>
        
        <div className={`${oswald.className} text-lg text-gray-700 space-y-6`}>
          <ResultContent />
        </div>
      </div>
    </div>
  );
}
