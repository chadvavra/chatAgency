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

export const saveIdea = async (userId: string, generatedIdea: string, valuePropositions: string[]) => {
  const supabase = createClient();
  
  const updateData = {
    user_id: userId,
    idea: originalIdea,
    generated_idea: generatedIdea,
    value_propositions: valuePropositions
  };

  console.log('Saving idea with data:', updateData);

  const result = await supabase
    .from('ideas')
    .upsert(updateData, { onConflict: 'user_id' });

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

