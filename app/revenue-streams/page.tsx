import React from 'react';
import RevenueStreamsContent from './RevenueStreamsContent';
import LeftNavigation from '@/components/LeftNavigation';

export default function RevenueStreamsPage({ searchParams }: { searchParams: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* <div className="w-1/4 p-4">
        <LeftNavigation ideaId={searchParams.id} />
      </div> */}
      <div className="mb-4">
        <RevenueStreamsContent ideaId={searchParams.id} />
      </div>
    </div>
  );
}
