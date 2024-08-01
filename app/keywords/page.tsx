import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const KeywordsContent = dynamic(() => import('./KeywordsContent'), {
  loading: () => <div>Loading...</div>,
});

export default function KeywordsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KeywordsContent />
    </Suspense>
  );
}
