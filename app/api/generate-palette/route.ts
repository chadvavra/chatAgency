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
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `Given the following adjectives, provide exactly 5 hex codes and names for colors that represent the adjectives. Separate the adjectives with commas:

          ${idea.generated_idea}

          5 colors:`
        }
      ]
    });

    let generatedText = '';
    if (response.content[0].type === 'text') {
      generatedText = response.content[0].text;
    } else {
      throw new Error('Unexpected response format from Anthropic API');
    }

    const generatedColors = generatedText.trim().split(',').map(color => color.trim());

    // Save colors to the database
    const { error: updateError } = await supabase
      .from('ideas')
      .update({ colors: generatedColors })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: 'Error saving colors' }, { status: 500 });
    }

    return NextResponse.json({ colors: generatedColors });
  } catch (error) {
    console.error('Error generating colors:', error);
    return NextResponse.json({ error: 'Failed to generate colors' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
