'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import NavLinks from './NavLinks';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  return (
    <header className="w-full p-4 bg-background">
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/favicon.ico" alt="Chat Agency AI Logo" width={32} height={32} />
        </Link>
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
        <nav className="hidden md:flex items-center gap-4">
          <NavLinks user={user} />
        </nav>
      </div>
      {isMenuOpen && (
        <nav className="mt-4 flex flex-col items-center gap-2 md:hidden">
          <NavLinks user={user} />
        </nav>
      )}
    </header>
  );
}
