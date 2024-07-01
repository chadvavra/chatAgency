
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: 'my_api_key', // defaults to process.env["ANTHROPIC_API_KEY"]
  });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { prompt } = req.body;
      const completion = await anthropic.completions.create({
        model: "claude-3-5-sonnet-20240620",
        prompt: prompt,
        max_tokens_to_sample: 300,
      });
      res.status(200).json({ response: completion.completion });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}