'use client';

import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

  return (
    <header className="w-full p-4 bg-background">
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">Chat Agency AI</span>
        </Link>
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
        <nav className="hidden md:flex items-center gap-4">
          {user && (
            <Link href="/dashboard" className="bg-btn-background hover:bg-btn-background-hover rounded-md px-4 py-2 text-foreground no-underline">
              Dashboard
            </Link>
          )}
          {user ? (
            <button onClick={signOut} className="bg-btn-background hover:bg-btn-background-hover rounded-md px-4 py-2 text-foreground">
              Log out
            </button>
          ) : (
            <Link href="/login" className="bg-btn-background hover:bg-btn-background-hover rounded-md px-4 py-2 text-foreground no-underline">
              Log in
            </Link>
          )}
        </nav>
      </div>
      {isMenuOpen && (
        <nav className="mt-4 flex flex-col gap-2 md:hidden">
          {user && (
            <Link href="/dashboard" className="bg-btn-background hover:bg-btn-background-hover rounded-md px-4 py-2 text-foreground no-underline">
              Dashboard
            </Link>
          )}
          {user ? (
            <button onClick={signOut} className="bg-btn-background hover:bg-btn-background-hover rounded-md px-4 py-2 text-foreground">
              Log out
            </button>
          ) : (
            <Link href="/login" className="bg-btn-background hover:bg-btn-background-hover rounded-md px-4 py-2 text-foreground no-underline">
              Log in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
