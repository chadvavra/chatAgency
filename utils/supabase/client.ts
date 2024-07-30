import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
      cookies: {
        get(name: string) {
          return document.cookie.split('; ').find(row => row.startsWith(`${name}=`))?.split('=')[1];
        },
        set(name: string, value: string, options: any) {
          document.cookie = `${name}=${value}; max-age=${60 * 60 * 24 * 7}; path=/; samesite=lax`;
        },
        remove(name: string, options: any) {
          document.cookie = `${name}=; max-age=0; path=/; samesite=lax`;
        },
      },
    }
  );

  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session);
  });

  return supabase;
};

export const saveIdea = async (userId: string, idea: string, generatedIdea: string, valuePropositions: string[]) => {
  const supabase = createClient();
  
  // First, check if a record exists for this user
  const { data: existingData, error: fetchError } = await supabase
    .from('ideas')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Supabase fetch error:', fetchError);
    throw new Error(`Failed to check existing idea: ${fetchError.message}`);
  }

  const updateData = {
    user_id: userId,
    original_idea: idea || existingData?.original_idea || null,
    generated_idea: generatedIdea || existingData?.generated_idea || null,
    value_propositions: valuePropositions.length > 0 ? valuePropositions : existingData?.value_propositions || null
  };

  console.log('Saving idea with data:', updateData);

  let result;
  if (existingData) {
    // If a record exists, update it
    result = await supabase
      .from('ideas')
      .update(updateData)
      .eq('user_id', userId);
  } else {
    // If no record exists, insert a new one
    result = await supabase
      .from('ideas')
      .insert(updateData);
  }

  if (result.error) {
    console.error('Supabase error:', result.error);
    throw new Error(`Failed to save idea: ${result.error.message}`);
  }
  return result.data;
};

export const getIdea = async (userId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
};

