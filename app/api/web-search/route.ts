import { NextResponse } from 'next/server';
import { webSearchWithAI } from '@/utils/braveSearch';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
    }

    const searchResult = await webSearchWithAI(query);

    return NextResponse.json({ result: searchResult });
  } catch (error) {
    console.error('Error in web search:', error);
    return NextResponse.json({ error: 'Failed to perform web search' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
