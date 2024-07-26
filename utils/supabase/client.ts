import { createBrowserClient, CookieOptions } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        headers: {
          'X-Forwarded-Proto': 'https',
        },
      },
      cookies: {
        get(name: string) {
          return document.cookie.split('; ').find(row => row.startsWith(`${name}=`))?.split('=')[1];
        },
        set(name: string, value: string, options: CookieOptions) {
          document.cookie = `${name}=${value}; max-age=${options.maxAge}; path=${options.path}; domain=${options.domain}; samesite=${options.sameSite}; secure`;
        },
        remove(name: string, options: CookieOptions) {
          document.cookie = `${name}=; max-age=0; path=${options.path}; domain=${options.domain}; samesite=${options.sameSite}; secure`;
        },
      },
    }
  );

export const saveIdea = async (userId: string, initialIdea: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('business_ideas')
    .upsert({ user_id: userId, initial_idea: initialIdea }, { onConflict: 'user_id' })
    .select();
  
  if (error) throw error;
  return data;
};

export const updateDetailedIdea = async (userId: string, detailedIdea: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('business_ideas')
    .update({ detailed_idea: detailedIdea })
    .eq('user_id', userId)
    .select();
  
  if (error) throw error;
  return data;
};

export const updateValuePropositions = async (userId: string, valuePropositions: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('business_ideas')
    .update({ value_propositions: valuePropositions })
    .eq('user_id', userId)
    .select();
  
  if (error) throw error;
  return data;
};

