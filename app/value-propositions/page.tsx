import ValuePropositionsContent from './ValuePropositionsContent';

export default function ValuePropositionsPage() {
  return <ValuePropositionsContent />;
}
import React, { Suspense } from 'react';
import ValuePropositionsContent from './ValuePropositionsContent';

export default function ValuePropositionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ValuePropositionsContent />
    </Suspense>
  );
}
