'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [authorized, setAuthorized] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const isAdmin = window.localStorage.getItem('kraveat-admin-authorized') === 'true';
    setAuthorized(isAdmin);
  }, []);

  const isAdminPage = pathname === '/admin';

  if (isAdminPage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-brown/10 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/assets/imagewithlogo1.png" alt="KraveEat logo" width={40} height={40} className="rounded-full" />
          <div>
            <p className="text-lg font-black text-brown">KraveEat</p>
            <p className="text-xs text-orange">Fast food in Abuja</p>
          </div>
        </Link>
        <div className="flex items-center gap-2 text-sm font-semibold text-brown">
          <Link href="/menu" className="rounded-full px-3 py-2 hover:bg-white/70">Menu</Link>
          <Link href="/checkout" className="rounded-full bg-brown px-3 py-2 text-white">Checkout</Link>
          {authorized && (
            <Link href="/admin" className="rounded-full border border-brown/20 px-3 py-2">Admin</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
