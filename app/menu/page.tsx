'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const menuItems = [
  { id: 1, name: 'Classic Burger', category: 'Burger', price: 4500, image: '/assets/imagewithlogo2.jpeg', description: 'Classic double beef burger with cheese.' },
  { id: 2, name: 'Chicken Shawarma', category: 'Shawarma', price: 3500, image: '/assets/imagewithlogo2.jpeg', description: 'Chicken shawarma with fresh veggies.' },
  { id: 3, name: 'Loaded Fries', category: 'Loaded Fries', price: 2800, image: '/assets/imagewithlogo3.jpeg', description: 'Loaded fries with cheese and sauce.' },
  { id: 4, name: 'Chicken & Chips', category: 'Chicken & Chips', price: 4200, image: '/assets/imagewithlogo4.jpeg', description: 'Crispy chicken with golden chips.' }
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', ...Array.from(new Set(menuItems.map((item) => item.category)))];

  const filteredItems = activeCategory === 'All' ? menuItems : menuItems.filter((item) => item.category === activeCategory);

  return (
    <main className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange">Menu</p>
          <h1 className="text-3xl font-black text-brown">KraveEat favorites</h1>
        </div>
        <Link href="/checkout" className="rounded-full bg-brown px-4 py-2 font-semibold text-white">Checkout</Link>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-wrap gap-3">
        {categories.map((category) => (
          <button key={category} onClick={() => setActiveCategory(category)} className={`rounded-full px-4 py-2 text-sm font-semibold ${activeCategory === category ? 'bg-orange text-brown' : 'bg-white text-brown/80'}`}>
            {category}
          </button>
        ))}
      </div>

      <section className="mx-auto mt-8 grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-4">
        {filteredItems.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm">
            <Image src={item.image} alt={item.name} width={600} height={400} className="h-44 w-full object-cover" />
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-brown">{item.name}</h2>
                <span className="rounded-full bg-orange/20 px-2.5 py-1 text-sm font-semibold text-orange">₦{item.price}</span>
              </div>
              <p className="text-sm text-brown/70">{item.description}</p>
              <a href="https://wa.me/2349030707047?text=Hello%20KraveEat%2C%20I%20want%20to%20order%20the%20${encodeURIComponent(item.name)}" target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-brown px-4 py-2 text-sm font-semibold text-white">Order on WhatsApp</a>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
