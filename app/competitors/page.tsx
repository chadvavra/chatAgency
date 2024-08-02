import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const CompetitorsContent = dynamic(() => import('./CompetitorsContent'));

export default function CompetitorsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompetitorsContent />
    </Suspense>
  );
}
