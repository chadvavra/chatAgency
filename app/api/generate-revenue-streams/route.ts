import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { ChatCompletionRequestMessage } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi } from 'openai-edge';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

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

  const messages: ChatCompletionRequestMessage[] = [
    { role: 'system', content: 'You are a business strategy expert specializing in revenue stream generation.' },
    { role: 'user', content: `Based on the following business idea and value propositions, generate 3-5 potential revenue streams. Explain each revenue stream briefly and why it's suitable for this business idea.\n\nBusiness Idea: ${generated_idea}\n\nValue Propositions: ${value_propositions}` },
  ];

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.7,
    stream: true,
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
