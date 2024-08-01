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
      .select('original_idea, generated_idea, image_urls')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching idea:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch idea' }, { status: 500 });
    }

    if (!idea || !idea.generated_idea) {
      return NextResponse.json({ error: 'Generated idea not found' }, { status: 404 });
    }

    // If not regenerating and images already exist, return the existing images
    if (!regenerate && idea.image_urls && idea.image_urls.length > 0) {
      return NextResponse.json({ imageUrls: idea.image_urls, originalIdea: idea.original_idea });
    }

    const ideaDescription = idea.generated_idea;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: ideaDescription,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;

    if (!imageUrl) {
      throw new Error('No image URL generated');
    }

    // Download the image
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();

    // Generate a unique filename
    const filename = `${id}_${Date.now()}.png`;

    // Upload the image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('idea-images')
      .upload(filename, imageBuffer, {
        contentType: 'image/png',
      });

    if (uploadError) {
      console.error('Error uploading image to storage:', uploadError);
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    // Get the public URL of the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from('idea-images')
      .getPublicUrl(filename);

    const storedImageUrl = publicUrlData.publicUrl;

    // Update the image URLs in the ideas table
    const { data: currentIdea, error: getCurrentError } = await supabase
      .from('ideas')
      .select('image_urls')
      .eq('id', id)
      .single();

    if (getCurrentError) {
      console.error('Error getting current idea:', getCurrentError);
      return NextResponse.json({ error: 'Failed to get current idea' }, { status: 500 });
    }

    const updatedImageUrls = currentIdea.image_urls ? [...currentIdea.image_urls, storedImageUrl] : [storedImageUrl];

    const { error: updateError } = await supabase
      .from('ideas')
      .update({ image_urls: updatedImageUrls })
      .eq('id', id);

    if (updateError) {
      console.error('Error saving image to database:', updateError);
      return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
    }

    return NextResponse.json({ imageUrls: updatedImageUrls });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return POST(request);
}

export const dynamic = 'force-dynamic';
