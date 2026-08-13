'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authorized, setAuthorized] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('kraveat-admin-authorized') === 'true';
  });
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, cartTotal } = useCart();

  const isAdminPage = pathname === '/admin';

  if (isAdminPage) {
    return null;
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/checkout', label: 'Checkout' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-brown/10 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/assets/imagewithlogo1.png" alt="KraveEat logo" width={40} height={40} className="rounded-full" />
          <div>
            <p className="text-lg font-black text-brown leading-none">KraveEat</p>
            <p className="text-xs text-orange">Fast food in Abuja</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2 text-sm font-semibold text-brown">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-2 hover:bg-white/70 ${
                pathname === link.href ? 'bg-white/70 text-orange' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`https://wa.me/2349030707047`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-green-600 px-3 py-2 text-white hover:bg-green-700"
          >
            WhatsApp
          </a>
          {authorized && (
            <Link href="/admin" className="rounded-full border border-brown/20 px-3 py-2">
              Admin
            </Link>
          )}
          <Link
            href="/checkout"
            className="relative rounded-full bg-brown px-3 py-2 text-white hover:bg-brown/90"
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange text-xs font-black text-brown">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <Link href="/checkout" className="relative rounded-full bg-brown px-3 py-2 text-white">
            Cart
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange text-xs font-black text-brown">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-full bg-white/70 p-2 text-brown"
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-brown/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-cream shadow-2xl">
            <div className="flex items-center justify-between border-b border-brown/10 p-4">
              <p className="text-lg font-black text-brown">Menu</p>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-full bg-white/70 p-2 text-brown"
                aria-label="Close menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-1 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-2xl px-4 py-3 text-base font-semibold ${
                    pathname === link.href ? 'bg-brown text-white' : 'text-brown hover:bg-white/70'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`https://wa.me/2349030707047`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-2xl bg-green-600 px-4 py-3 text-base font-semibold text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.03-1.383l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Order on WhatsApp
              </a>
              {authorized && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-base font-semibold text-brown hover:bg-white/70"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
