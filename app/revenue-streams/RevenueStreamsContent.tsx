"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface RevenueStreamsContentProps {
  ideaId: string;
}

const RevenueStreamsContent: React.FC<RevenueStreamsContentProps> = ({ ideaId }) => {
  const [revenueStreams, setRevenueStreams] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    fetchRevenueStreams();
  }, [ideaId]);

  const fetchRevenueStreams = async () => {
    setIsLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('ideas')
      .select('revenue_streams')
      .eq('id', ideaId)
      .single();

    if (error) {
      setError('Failed to fetch revenue streams');
      setIsLoading(false);
      return;
    }

    if (data && data.revenue_streams) {
      setRevenueStreams(data.revenue_streams);
    }
    setIsLoading(false);
  };

  const generateRevenueStreams = async () => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`/api/generate-revenue-streams?id=${ideaId}`, {
      method: 'POST',
    });

    if (!response.ok) {
      setError('Failed to generate revenue streams');
      setIsLoading(false);
      return;
    }

    const data = await response.json();
    setRevenueStreams(data.revenueStreams);

    // Update the database with the new revenue streams
    const { error: updateError } = await supabase
      .from('ideas')
      .update({ revenue_streams: data.revenueStreams })
      .eq('id', ideaId);

    if (updateError) {
      setError('Failed to save revenue streams');
    }

    setIsLoading(false);
  };

  return (
    <div className="">

  
      <div className="flex flex-col w-3/4">

        <h1 className="text-2xl font-bold mb-4">Revenue Streams</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {isLoading ? (
          <p>Loading...</p>
        ) : revenueStreams ? (
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-semibold mb-2">Proposed Revenue Streams:</h2>
            <div className="whitespace-pre-wrap">{revenueStreams}</div>
          </div>
        ) : (
          <p>No revenue streams generated yet.</p>
        )}
        <button
          onClick={generateRevenueStreams}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {isLoading ? 'Generating...' : 'Generate Revenue Streams'}
        </button>
      </div>

      <button
        onClick={() => router.back()}
        className="mt-6 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded transition duration-300"
      >
        Back
      </button>
    </div>
  );
};

export default RevenueStreamsContent;
