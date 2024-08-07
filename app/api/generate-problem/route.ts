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
    .select('generated_idea')
    .eq('id', id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: 'Failed to fetch idea' }, { status: 500 });
  }

  if (!idea || !idea.generated_idea) {
    return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
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
          content: `Given the following business idea, define a problem that necessitates the idea and then perform a "5 Whys" exercise to validate it:

          ${idea.generated_idea}

          5 Whys:`
        }
      ]
    });

    let generatedText = '';
    if (response.content[0].type === 'text') {
      generatedText = response.content[0].text;
    } else {
      throw new Error('Unexpected response format from Anthropic API');
    }

    const generatedProblem = generatedText.trim().split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(adj => adj.trim());

    // Save adjectives to the database
    const { error: updateError } = await supabase
      .from('ideas')
      .update({ problem: generatedProblem })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: 'Error saving problem' }, { status: 500 });
    }

    return NextResponse.json({ problem: generatedProblem });
  } catch (error) {
    console.error('Error generating problem:', error);
    return NextResponse.json({ error: 'Failed to generate problem' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
