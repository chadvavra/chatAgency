import { NextRequest, NextResponse } from 'next/server';
import { generateIdea } from '@/utils/anthropic';

export async function POST(req: NextRequest) {
  const { idea } = await req.json();

  try {
    const generatedIdea = await generateIdea(idea);
    return NextResponse.json({ generatedIdea });
  } catch (error) {
    console.error('Error generating idea:', error);
    return NextResponse.json({ error: 'Failed to generate idea' }, { status: 500 });
  }
}
