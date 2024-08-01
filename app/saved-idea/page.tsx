import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { FaCopy } from 'react-icons/fa';

const SavedIdeaContent = dynamic(() => import('./SavedIdeaContent'), { ssr: false });

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SavedIdeaContent FaCopy={FaCopy} />
    </Suspense>
  );
}
