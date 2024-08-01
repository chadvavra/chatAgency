'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function NavLinks({ user }: { user: any }) {
  const router = useRouter();

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <>
      {user && (
        <Link href="/dashboard" className="bg-btn-background hover:bg-btn-background-hover rounded-md px-4 py-2 text-foreground no-underline">
          Dashboard
        </Link>
      )}
      {user ? (
        <button onClick={signOut} className="bg-btn-background hover:bg-btn-background-hover rounded-md px-4 py-2 text-foreground no-underline">
          Log out
        </button>
      ) : (
        <Link href="/login" className="bg-btn-background hover:bg-btn-background-hover rounded-md px-4 py-2 text-foreground no-underline">
          Log in
        </Link>
      )}
    </>
  );
}
