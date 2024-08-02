import { Anthropic } from '@anthropic-ai/sdk';
import axios from 'axios';

const anthropic = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
});

const NEXT_PUBLIC_BRAVE_API_KEY = process.env.NEXT_PUBLIC_BRAVE_API_KEY;
const BRAVE_SEARCH_URL = 'https://api.search.brave.com/res/v1/web/search';

const axiosInstance = axios.create({
  config: {
    transitional: {
      silentJSONParsing: true,
    },
  },
});

async function braveSearch(query: string, count: number = 3): Promise<string> {
  try {
    const response = await axiosInstance.get(BRAVE_SEARCH_URL, {
      params: { q: query, count: count },
      headers: { 'X-Subscription-Token': NEXT_PUBLIC_BRAVE_API_KEY },
    });

    const results = response.data.web.results;
    return results.map((result: any) => `${result.title}\n${result.url}\n${result.description}`).join('\n\n');
  } catch (error) {
    console.error('Error performing Brave search:', error);
    return 'Error performing web search';
  }
}

export async function webSearchWithAI(query: string): Promise<string> {
  const searchResults = await braveSearch(query);

  const response = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: `Here are some web search results for the query "${query}":\n\n${searchResults}\n\nPlease summarize the key information from these results, focusing on the most relevant and important points related to the query.`,
      },
    ],
  });

  return response.content[0].type === 'text' ? response.content[0].text : 'Error processing search results';
}
