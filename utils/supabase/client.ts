import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

