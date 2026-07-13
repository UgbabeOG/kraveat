'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const featuredMenu = [
  { id: 1, name: 'Classic Burger', category: 'Burger', price: 4500, image: '/assets/imagewithlogo2.jpeg', description: 'Beef burger with lettuce, tomato, cheese and sauce.' },
  { id: 2, name: 'Chicken Shawarma', category: 'Shawarma', price: 3500, image: '/assets/imagewithlogo2.jpeg', description: 'Spiced chicken wrapped in soft pita with fresh toppings.' },
  { id: 3, name: 'Loaded Fries', category: 'Loaded Fries', price: 2800, image: '/assets/imagewithlogo3.jpeg', description: 'Golden fries topped with cheese, sauce and herbs.' },
  { id: 4, name: 'Chicken & Chips', category: 'Chicken & Chips', price: 4200, image: '/assets/imagewithlogo5.jpeg', description: 'Crispy chicken served with fries and dip.' }
];

export default function HomePage() {
  const router = useRouter();
  const [cart, setCart] = useState<number[]>([]);

  const addToCart = (id: number) => {
    setCart((prev) => [...prev, id]);
  };

  const total = useMemo(() => {
    return cart.reduce((sum, id) => {
      const item = featuredMenu.find((entry) => entry.id === id);
      return sum + (item?.price ?? 0);
    }, 0);
  }, [cart]);

  return (
    <main className="min-h-screen bg-cream">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Image src="/assets/imagewithlogo1.png" alt="KraveEat logo" width={48} height={48} className="rounded-full" />
          <div>
            <p className="text-xl font-black text-brown">KraveEat</p>
            <p className="text-sm text-orange">Fast food in Abuja</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-brown">
          <Link href="/menu" className="rounded-full px-3 py-2 hover:bg-white/70">Menu</Link>
          <Link href="/checkout" className="rounded-full bg-brown px-3 py-2 text-white">Cart ({cart.length})</Link>
          <Link href="/admin" className="rounded-full border border-brown/20 px-3 py-2">Admin</Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-20">
        <div className="space-y-6 rounded-[2rem] bg-white/70 p-6 shadow-lg shadow-brown/10 sm:p-8">
          <div className="inline-flex rounded-full bg-orange/20 px-3 py-1 text-sm font-semibold text-orange">Abuja • South End Estate</div>
          <h1 className="text-4xl font-black leading-tight text-brown sm:text-5xl">Get ready to savor every bite of our irresistible fast food</h1>
          <p className="max-w-xl text-lg text-brown/80">Premium burgers, shawarma, loaded fries and chicken & chips delivered with speed and flavor.</p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => router.push('/menu')} className="rounded-full bg-orange px-5 py-3 font-semibold text-brown transition hover:scale-105">ORDER & SHOP NOW</button>
            <a href="https://wa.me/2349030707047" target="_blank" rel="noreferrer" className="rounded-full border border-brown/20 px-5 py-3 font-semibold text-brown">WhatsApp Order</a>
          </div>
          <div className="flex flex-wrap gap-4 rounded-2xl bg-cream p-4 text-sm text-brown/80">
            <span>📍 South End Estate, Kyami District, airport road Abuja</span>
            <span>📞 09030707047</span>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem] bg-brown p-3 shadow-xl shadow-brown/20">
            <Image src="/assets/imagewithlogo2.jpeg" alt="Burger hero" width={700} height={900} className="h-64 w-full rounded-[1.5rem] object-cover" priority />
          </div>
          <div className="overflow-hidden rounded-[2rem] bg-orange p-3 shadow-xl shadow-orange/20">
            <Image src="/assets/imagewithlogo3.jpeg" alt="Shawarma hero" width={700} height={900} className="h-64 w-full rounded-[1.5rem] object-cover" priority />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] bg-white/70 p-6 shadow-lg shadow-brown/10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange">Brand story</p>
            <h2 className="mt-3 text-2xl font-black text-brown">Fast food, bold flavor, Abuja energy</h2>
            <p className="mt-3 text-brown/70">From sizzling burgers to loaded fries and juicy shawarma, KraveEat brings crave-worthy comfort food to South End Estate and beyond.</p>
          </div>
          <div className="overflow-hidden rounded-[2rem] bg-brown p-2 shadow-xl shadow-brown/20">
            <video src="/assets/imagewithlogo6.mp4" autoPlay loop muted playsInline className="h-72 w-full rounded-[1.5rem] object-cover" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black text-brown">Popular Orders</h2>
          <Link href="/menu" className="text-sm font-semibold text-orange">View full menu</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredMenu.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-[1.75rem] border border-brown/10 bg-white shadow-sm">
              <Image src={item.image} alt={item.name} width={600} height={400} className="h-44 w-full object-cover" />
              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-brown">{item.name}</h3>
                  <span className="rounded-full bg-orange/20 px-2.5 py-1 text-sm font-semibold text-orange">₦{item.price}</span>
                </div>
                <p className="text-sm text-brown/70">{item.description}</p>
                <button onClick={() => addToCart(item.id)} className="w-full rounded-full bg-brown px-4 py-2 font-semibold text-white">Add to cart</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-brown p-8 text-white">
          <h2 className="text-2xl font-black">Your cart preview</h2>
          <p className="mt-2 text-white/80">Add a few favorites, then proceed to checkout to complete your order.</p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white/10 p-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-orange">Total</p>
              <p className="text-3xl font-black">₦{total.toLocaleString()}</p>
            </div>
            <Link href="/checkout" className="rounded-full bg-orange px-5 py-3 font-semibold text-brown">Continue to checkout</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
