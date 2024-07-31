import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const IdeaContent = dynamic(() => import('./IdeaContent'), { ssr: false });

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IdeaContent />
    </Suspense>
  );
}
