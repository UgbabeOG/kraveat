'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        router.push('/admin');
      } else {
        setError('Invalid password');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange">
          Admin Access
        </p>
        <h1 className="mt-2 text-3xl font-black text-brown">
          KraveEat dashboard
        </h1>
        <p className="mt-2 text-sm text-brown/70">
          Use the password to access menu management.
        </p>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="mt-6 w-full rounded-full border border-brown/20 bg-cream px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
          placeholder="Enter password"
        />
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        <button className="mt-4 w-full rounded-full bg-orange px-4 py-3 font-semibold text-brown hover:bg-accent-hover transition">
          Login
        </button>
        <Link href="/" className="mt-4 block text-center text-sm font-semibold text-brown/70 hover:text-orange">
          Back to site
        </Link>
      </form>
    </main>
  );
}
