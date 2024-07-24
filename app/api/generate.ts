import { NextRequest, NextResponse } from 'next/server';
import { generateIdea } from '@/utils/anthropic';

export async function POST(req: NextRequest) {
  console.log('API route hit'); // Add this line
  try {
    const { idea } = await req.json();
    const generatedIdea = await generateIdea(idea);
    return NextResponse.json({ generatedIdea });
  } catch (error) {
    console.error('Error generating idea:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate idea', 
        details: error instanceof Error ? error.message : String(error) 
      }, 
      { status: 500 }
    );
  }
}
