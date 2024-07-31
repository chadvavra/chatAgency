import dynamic from 'next/dynamic';

const ValuePropositionsContent = dynamic(() => import('./ValuePropositionsContent'), { ssr: false });

export default function Page() {
  return <ValuePropositionsContent />;
}
