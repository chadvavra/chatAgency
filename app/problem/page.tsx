'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const SavedProblemContent = dynamic(() => import('./SavedProblemContent'));

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SavedProblemContent />
    </Suspense>
  );
}
