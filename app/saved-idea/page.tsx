'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const SavedIdeaContent = dynamic(() => import('./SavedIdeaContent'));

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SavedIdeaContent />
    </Suspense>
  );
}
