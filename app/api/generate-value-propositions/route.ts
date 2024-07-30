import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates value propositions for business ideas."
        },
        {
          role: "user",
          content: `Generate 5 unique value propositions for the following business idea: ${idea}`
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const content = completion.choices[0].message.content || '';
    const valuePropositions = content.split('\n')
      .filter(vp => vp.trim() !== '')
      .map(vp => vp.replace(/^\d+\.\s*/, '').trim()) // Remove numbering if present
      .slice(0, 5); // Ensure we have at most 5 propositions

    return NextResponse.json({ valuePropositions });
  } catch (error) {
    console.error('Error in generate-value-propositions:', error);
    return NextResponse.json({ error: 'Failed to generate value propositions' }, { status: 500 });
  }
}
