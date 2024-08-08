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

export const saveIdea = async (userId: string, originalIdea: string, generatedIdea: string) => {
  const supabase = createClient();
  
  const newIdea = {
    user_id: userId,
    original_idea: originalIdea || '',
    generated_idea: generatedIdea || ''
  };

  console.log('Saving new idea with data:', newIdea);

  const { data, error } = await supabase
    .from('ideas')
    .insert(newIdea)
    .select();

  if (error) {
    console.error('Supabase error:', error);
    throw new Error(`Failed to save idea: ${error.message}`);
  }
  
  console.log('New idea saved successfully:', data);
  return data[0];
};

export const saveValueProp = async (userId: string, valuePropositions: string[]) => {
  const supabase = createClient();
  
  const newValueProp = {
    user_id: userId,
    value_propositions: valuePropositions || []
  };

  console.log('Saving new Value Propositions with data:', newValueProp);

  const { data, error } = await supabase
    .from('ideas')
    .insert(newValueProp)
    .select();

  if (error) {
    console.error('Supabase error:', error);
    throw new Error(`Failed to save Value propositions: ${error.message}`);
  }
  
  console.log('Value Propostions saved successfully:', data);
  return data[0];
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

