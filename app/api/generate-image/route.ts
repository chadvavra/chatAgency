import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing idea ID' }, { status: 400 });
  }

  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key is not set' }, { status: 500 });
  }

  const supabase = createClient();

  // Check if an image already exists for this idea
  const { data: existingIdea } = await supabase
    .from('ideas')
    .select('image_url')
    .eq('id', id)
    .single();

  if (existingIdea && existingIdea.image_url) {
    return NextResponse.json({ imageUrl: existingIdea.image_url });
  }

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });

  try {
    // TODO: Fetch the idea description from your database using the id
    const ideaDescription = "A futuristic smart home device"; // Replace this with actual idea fetching logic

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

export const dynamic = 'force-dynamic';
