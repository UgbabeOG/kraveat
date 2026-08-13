'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-brown/10 bg-white/70">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-lg font-black text-brown">KraveEat</p>
            <p className="text-sm text-brown/60">Fast food in Abuja</p>
            <p className="mt-2 text-sm text-brown/70">South End Estate, Kyami District, airport road Abuja</p>
            <p className="text-sm text-brown/70">📞 09030707047</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-brown/70">
            <Link href="/menu" className="hover:text-orange">Menu</Link>
            <Link href="/checkout" className="hover:text-orange">Checkout</Link>
            <a href="https://wa.me/2349030707047" target="_blank" rel="noreferrer" className="hover:text-orange">WhatsApp</a>
          </div>
          <p className="text-sm text-brown/50">
            &copy; {new Date().getFullYear()} KraveEat. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
