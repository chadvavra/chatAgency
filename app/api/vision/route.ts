import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { generateIdea } from '@/utils/anthropic';

export async function POST(req: Request) {
  try {
    const { answers, ideaId } = await req.json();

    // Create Supabase client
    const cookieStore = cookies();
    const supabase = createClient();

    // Fetch the generated idea from the ideas table
    const { data: ideaData, error: ideaError } = await supabase
      .from('ideas')
      .select('generated_idea')
      .eq('id', ideaId)
      .single();

    if (ideaError) {
      throw new Error(`Error fetching idea: ${ideaError.message}`);
    }

    const generatedIdea = ideaData?.generated_idea;

    // Prepare the prompt for vision generation
    const prompt = `
      Based on the following information, generate a compelling vision statement for a business or product idea:

      Generated Idea:
      ${generatedIdea}

      Vision Questions and Answers:
      ${Object.entries(answers).map(([question, answer]) => `${question}: ${answer}`).join('\n')}

      Please create a concise, inspiring vision statement that captures the essence of this idea and its potential impact. The vision statement should be forward-looking, ambitious, and aligned with the core purpose of the idea.
    `;

    // Generate the vision statement using Anthropic's API
    const visionStatement = await generateIdea(prompt);

    // Ensure we're returning a response
    return NextResponse.json({ visionStatement });
  } catch (error) {
    console.error('Error in vision generation:', error);
    return NextResponse.json({ error: 'An error occurred during vision generation' }, { status: 500 });
  }
}
