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

    const completion = await anthropic.completions.create({
      model: "claude-2",
      max_tokens_to_sample: 300,
      prompt: `Given the following business idea, provide exactly 5 adjectives that best describe it. Separate the adjectives with commas:

      ${idea.generated_idea}

      5 adjectives:`,
    });

    const generatedAdjectives = completion.completion.trim().split(',').map(adj => adj.trim());

    // Save adjectives to the database
    const { error: updateError } = await supabase
      .from('ideas')
      .update({ adjectives: generatedAdjectives })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: 'Error saving adjectives' }, { status: 500 });
    }

    return NextResponse.json({ adjectives: generatedAdjectives });
  } catch (error) {
    console.error('Error generating keywords:', error);
    return NextResponse.json({ error: 'Failed to generate keywords' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
