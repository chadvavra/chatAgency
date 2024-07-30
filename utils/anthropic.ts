import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
});

export async function generateIdea(initialIdea: string): Promise<string> {
  const message = `
    You are an expert business consultant and product manager. Your task is to take a brief business idea or product feature and expand it into a detailed, well-thought-out concept. Please provide a comprehensive description, including potential target markets, key features, and possible challenges.

    Initial idea: ${initialIdea}

    Detailed concept:
  `;

  const response = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 2048,
    messages: [
      { role: 'user', content: message }
    ]
  });

  return response.content[0].text;
}
