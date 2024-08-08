'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LeftNavigation from '@/components/LeftNavigation';

const SavedProblemContent = dynamic(() => import('./SavedProblemContent'));

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProblemPageContent />
    </Suspense>
  );
}

function ProblemPageContent() {
  const searchParams = new URLSearchParams(window.location.search);
  const ideaId = searchParams.get('id') || '';

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/4 p-4">
        <LeftNavigation ideaId={ideaId} />
      </div>
      <div className="w-full md:w-3/4 p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <SavedProblemContent />
        </Suspense>
      </div>
    </div>
  );
}
