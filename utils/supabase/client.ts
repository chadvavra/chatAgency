import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

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

