import { NextRequest, NextResponse } from 'next/server';
import { generateIdea } from '@/utils/anthropic';

export async function POST(req: NextRequest) {
  console.log('API route hit');
  try {
    const { idea, changeRequest } = await req.json();
    let formattedPrompt;
    
    if (changeRequest) {
      formattedPrompt = `\n\nHuman: Here's an existing business idea or product feature: ${idea}\n\nPlease update or improve this idea based on the following request: ${changeRequest}. Keep the formatting consistent.\n\nAssistant:`;
    } else {
      formattedPrompt = `\n\nHuman: You are a highly experienced entrepreneur AI agent 
      that creates detailed descriptions of business ideas and product features. 
      Generate a detailed business idea or product feature based on the following concept: ${idea}
      Respond in markdown format.

      // <Section>A Headline for the Section</Section>
      // <Details>paragraphs, ordered, and unordered lists</Details>
      // <Summary>Summarize the Response</Summary>

      // <Business Overview>Detailed explaination of idea</Business Overview>
      // <Target Markets>List of potential markets that would benefit from the idea</Target Markets>
      // <Key Features>List of features that idea can offer</Key Features>
      // <Challenges>List of challenges the idea will face</Challenges>
      // <Summary>A summarization of the idea</Summary>

      \n\nAssistant:`;
    }
    
    console.log('Formatted prompt:', formattedPrompt);
    const generatedIdea = await generateIdea(formattedPrompt);
    console.log('Generated idea:', generatedIdea);
    return NextResponse.json({ generatedIdea });
  } catch (error: unknown) {
    console.error('Error generating idea:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    let errorDetails = 'No additional details';
    if (error instanceof Error && 'response' in error) {
      const responseData = (error.response as any)?.data;
      errorDetails = responseData ? JSON.stringify(responseData) : 'No response data';
    }
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to generate idea', 
        message: errorMessage,
        details: errorDetails
      }), 
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
