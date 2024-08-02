'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WebSearchPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/web-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to perform web search');
      }

      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      setError('An error occurred while performing the web search');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Web Search Tool</h1>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search query"
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Search Results:</h2>
          <p className="whitespace-pre-wrap">{result}</p>
        </div>
      )}

      <button
        onClick={() => router.back()}
        className="mt-6 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
      >
        Back
      </button>
    </div>
  );
}
