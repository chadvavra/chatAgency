import { NextRequest, NextResponse } from 'next/server';
import { generateIdea } from '@/utils/anthropic';

export async function POST(req: NextRequest) {
  try {
    const { idea } = await req.json();
    const formattedPrompt = `\n\nHuman: Generate 5 unique value propositions for the following business idea: ${idea} Please provide your response as a numbered list of exactly 5 value propositions, with no additional text or     
 explanations. Provide data to back up the value and references when you can.\n\nAssistant:`;
    
    const generatedContent = await generateIdea(formattedPrompt);
    
    const valuePropositions = generatedContent
      .split('\n')
      .filter(vp => vp.trim() !== '')
      .map(vp => vp.replace(/^\d+\.\s*/, '').trim())
      .slice(0, 5);

    return NextResponse.json({ valuePropositions });
  } catch (error: unknown) {
    console.error('Error generating value propositions:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        error: 'Failed to generate value propositions', 
        message: errorMessage
      }, 
      { status: 500 }
    );
  }
}
