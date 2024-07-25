import SupabaseLogo from "./SupabaseLogo";
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Header() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const signOut = async () => {
    'use server';
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect('/login');
  };

  return (
    <header className="w-full p-4 bg-background flex justify-between items-center">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-xl font-bold">Chat Agency AI</span>
      </Link>
      <nav>
        {user ? (
          <form action={signOut}>
            <button type="submit" className="bg-btn-background hover:bg-btn-background-hover rounded-md px-4 py-2 text-foreground">
              Log out
            </button>
          </form>
        ) : (
          <Link href="/login" className="bg-btn-background hover:bg-btn-background-hover rounded-md px-4 py-2 text-foreground no-underline">
            Log in
          </Link>
        )}
      </nav>
    </header>
  );
}
