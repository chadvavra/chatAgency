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
  
  // First, check if an idea already exists for this user
  const { data: existingIdea, error: fetchError } = await supabase
    .from('ideas')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    // PGRST116 means no rows returned, which is fine
    throw fetchError;
  }

  let result;
  if (existingIdea) {
    // If an idea exists, update it
    const { data, error } = await supabase
      .from('ideas')
      .update({ 
        idea: idea, 
        generated_idea: generatedIdea, 
        value_propositions: JSON.stringify(valuePropositions) 
      })
      .eq('user_id', userId)
      .select();
    
    if (error) throw error;
    result = data;
  } else {
    // If no idea exists, insert a new one
    const { data, error } = await supabase
      .from('ideas')
      .insert({ 
        user_id: userId, 
        idea: idea, 
        generated_idea: generatedIdea, 
        value_propositions: JSON.stringify(valuePropositions) 
      })
      .select();
    
    if (error) throw error;
    result = data;
  }

  return result;
};

export const getIdea = async (userId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

