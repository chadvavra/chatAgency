import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { StreamingTextResponse, AnthropicStream } from 'ai';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { ideaId } = await req.json();

  const supabase = createClient();

  // Fetch the idea and value propositions from the database
  const { data, error } = await supabase
    .from('ideas')
    .select('generated_idea, value_propositions')
    .eq('id', ideaId)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch idea data' }, { status: 500 });
  }

  const { generated_idea, value_propositions } = data;

  const prompt = `You are a business strategy expert specializing in revenue stream generation. Based on the following business idea and value propositions, generate 3-5 potential revenue streams. Explain each revenue stream briefly and why it's suitable for this business idea.

Business Idea: ${generated_idea}

Value Propositions: ${value_propositions}

Please provide your response in a clear, structured format.`;

  const response = await anthropic.completions.create({
    model: 'claude-2',
    prompt,
    max_tokens_to_sample: 1000,
    temperature: 0.7,
    stream: true,
  });

  const stream = AnthropicStream(response);

  return new StreamingTextResponse(stream);
}
