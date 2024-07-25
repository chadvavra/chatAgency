import React, { Suspense } from 'react';
import ValuePropositionsContent from './ValuePropositionsContent';

export default function ValuePropositionsPage({
  searchParams,
}: {
  searchParams: { generatedIdea: string };
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ValuePropositionsContent generatedIdea={searchParams.generatedIdea} />
    </Suspense>
  );
}
