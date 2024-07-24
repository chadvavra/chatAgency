import { NextRequest, NextResponse } from 'next/server';
import { generateIdea } from '@/utils/anthropic';

export async function POST(req: NextRequest) {
  console.log('API route hit');
  try {
    const { idea, changeRequest } = await req.json();
    let formattedPrompt;
    
    if (changeRequest) {
      formattedPrompt = `\n\nHuman: Here's an existing business idea or product feature: ${idea}\n\nPlease update or improve this idea based on the following request: ${changeRequest}\n\nAssistant:`;
    } else {
      formattedPrompt = `\n\nHuman: Generate a detailed business idea or product feature based on the following concept: ${idea}\n\nAssistant:`;
    }
    
    console.log('Formatted prompt:', formattedPrompt);
    const generatedIdea = await generateIdea(formattedPrompt);
    console.log('Generated idea:', generatedIdea);
    return NextResponse.json({ generatedIdea });
  } catch (error: unknown) {
    console.error('Error generating idea:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails = error instanceof Error && 'response' in error && error.response?.data ? JSON.stringify(error.response.data) : 'No additional details';
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
