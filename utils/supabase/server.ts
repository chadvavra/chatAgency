import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = () => {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
      },
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
};

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
