import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const regenerate = searchParams.get('regenerate') === 'true';

  if (!id) {
    return NextResponse.json({ error: 'Missing idea ID' }, { status: 400 });
  }

  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key is not set' }, { status: 500 });
  }

  const supabase = createClient();
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });

  try {
    // Fetch the generated idea from the database
    const { data: idea, error: fetchError } = await supabase
      .from('ideas')
      .select('generated_idea, image_url')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching idea:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch idea' }, { status: 500 });
    }

    if (!idea || !idea.generated_idea) {
      return NextResponse.json({ error: 'Generated idea not found' }, { status: 404 });
    }

    // If not regenerating and an image already exists, return the existing image
    if (!regenerate && idea.image_url) {
      return NextResponse.json({ imageUrl: idea.image_url });
    }

    const ideaDescription = idea.generated_idea;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: ideaDescription,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;

    // Update the image URL in the ideas table
    const { error: updateError } = await supabase
      .from('ideas')
      .update({ image_url: imageUrl })
      .eq('id', id);

    if (updateError) {
      console.error('Error saving image to database:', updateError);
      return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return POST(request);
}

export const dynamic = 'force-dynamic';
