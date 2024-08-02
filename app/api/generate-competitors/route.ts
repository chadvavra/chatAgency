import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Anthropic } from '@anthropic-ai/sdk';
import { webSearchWithAI } from '@/utils/braveSearch';

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

    const searchQuery = `competitors for ${idea.generated_idea}`;
    const searchResults = await webSearchWithAI(searchQuery);

    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `Based on the following web search results about competitors for a business idea, provide exactly 5 competitors doing inspiring work in the same space. For each competitor, provide their name, website, and a brief description of their inspiring work. Separate the competitors with semicolons. Use only real competitors mentioned in the search results. Don't make up any information.

          Search results:
          ${searchResults}

          5 competitors:`
        }
      ]
    });

    let generatedText = '';
    if (response.content[0].type === 'text') {
      generatedText = response.content[0].text;
    } else {
      throw new Error('Unexpected response format from Anthropic API');
    }

    const generatedCompetitors = generatedText.trim().split(';').map(comp => comp.trim());

    // Save competitors to the database
    const { error: updateError } = await supabase
      .from('ideas')
      .update({ competitors: generatedCompetitors })
      .eq('id', id);

    if (updateError) {
      console.error('Error saving competitors:', updateError);
      return NextResponse.json({ error: 'Error saving competitors' }, { status: 500 });
    }

    return NextResponse.json({ competitors: generatedCompetitors });
  } catch (error) {
    console.error('Error generating competitors:', error);
    return NextResponse.json({ error: 'Failed to generate competitors' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
