import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Anthropic } from '@anthropic-ai/sdk';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing idea ID' }, { status: 400 });
  }

  const supabase = createClient();

  // Fetch the idea from the database
  const { data: idea, error: fetchError } = await supabase
    .from('ideas')
    .select('generated_idea, value_propositions')
    .eq('id', id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: 'Failed to fetch idea' }, { status: 500 });
  }

  if (!idea || !idea.generated_idea || !idea.value_propositions) {
    return NextResponse.json({ error: 'Idea or value propositions not found' }, { status: 404 });
  }

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Given the following business idea and value propositions, generate 3-5 potential revenue streams. Explain each revenue stream briefly and why it's suitable for this business idea:

          Business Idea: ${idea.generated_idea}

          Value Propositions: ${idea.value_propositions}

          Please provide your response in a clear, structured format.`
        }
      ]
    });

    let generatedText = '';
    if (response.content[0].type === 'text') {
      generatedText = response.content[0].text;
    } else {
      throw new Error('Unexpected response format from Anthropic API');
    }

    // Save revenue streams to the database
    const { error: updateError } = await supabase
      .from('ideas')
      .update({ revenue_streams: generatedText })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: 'Error saving revenue streams' }, { status: 500 });
    }

    return NextResponse.json({ revenueStreams: generatedText });
  } catch (error) {
    console.error('Error generating revenue streams:', error);
    return NextResponse.json({ error: 'Failed to generate revenue streams' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
