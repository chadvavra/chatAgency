import { NextRequest, NextResponse } from 'next/server';
import { generateIdea } from '@/utils/anthropic';

export async function POST(req: NextRequest) {
  console.log('API route hit');
  try {
    const { idea } = await req.json();
    const formattedPrompt = `\n\nHuman: Generate a detailed business idea or product feature based on the following concept: ${idea}\n\nAssistant:`;
    console.log('Formatted prompt:', formattedPrompt);
    const generatedIdea = await generateIdea(formattedPrompt);
    console.log('Generated idea:', generatedIdea);
    return NextResponse.json({ generatedIdea });
  } catch (error) {
    console.error('Error generating idea:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails = error.response?.data ? JSON.stringify(error.response.data) : 'No additional details';
    return NextResponse.json(
      { 
        error: 'Failed to generate idea', 
        message: errorMessage,
        details: errorDetails
      }, 
      { status: 500 }
    );
  }
}
