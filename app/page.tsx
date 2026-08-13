'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { products, categories } from '@/lib/products';
import { formatNaira, cn } from '@/lib/utils';
import { getWhatsAppUrl } from '@/lib/whatsapp';

export default function HomePage() {
  const router = useRouter();
  const { addToCart, cartCount, cartTotal, items } = useCart();
  const [addedId, setAddedId] = useState<number | null>(null);

  const featuredProducts = products.filter((p) => p.featured);

  const handleAddToCart = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (product && product.available) {
      addToCart(product);
      setAddedId(productId);
      setTimeout(() => setAddedId(null), 1200);
    }
  };

  const cartItemsCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  return (
    <main className="min-h-screen bg-cream">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-20">
        <div className="space-y-6 rounded-[2rem] bg-white/70 p-6 shadow-lg shadow-brown/10 sm:p-8">
          <div className="inline-flex rounded-full bg-orange/20 px-3 py-1 text-sm font-semibold text-orange">
            Abuja • South End Estate
          </div>
          <h1 className="text-4xl font-black leading-tight text-brown sm:text-5xl lg:text-6xl text-balance">
            Your cravings called.
          </h1>
          <p className="max-w-xl text-lg text-brown/80">
            Premium burgers, shawarma, loaded fries and chicken & chips delivered fast to South End Estate and surrounding areas in Abuja.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push('/menu')}
              className="rounded-full bg-orange px-6 py-3 font-semibold text-brown transition hover:scale-105 hover:bg-accent-hover"
            >
              Browse Menu
            </button>
            <a
              href={getWhatsAppUrl('Hello KraveEat, I would like to place an order.')}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-brown/20 px-6 py-3 font-semibold text-brown hover:bg-white/70 transition"
            >
              Order on WhatsApp
            </a>
          </div>
          <div className="flex flex-wrap gap-4 rounded-2xl bg-cream p-4 text-sm text-brown/80">
            <span>📍 South End Estate, Kyami District, airport road Abuja</span>
            <span>📞 09030707047</span>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem] bg-brown p-3 shadow-xl shadow-brown/20">
            <Image
              src="/assets/imagewithlogo2.jpeg"
              alt="KraveEat burger"
              width={700}
              height={900}
              className="h-64 w-full rounded-[1.5rem] object-cover"
              priority
            />
          </div>
          <div className="overflow-hidden rounded-[2rem] bg-orange p-3 shadow-xl shadow-orange/20">
            <Image
              src="/assets/imagewithlogo3.jpeg"
              alt="KraveEat shawarma"
              width={700}
              height={900}
              className="h-64 w-full rounded-[1.5rem] object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] bg-white/70 p-6 shadow-lg shadow-brown/10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange">Brand story</p>
            <h2 className="mt-3 text-2xl font-black text-brown">Fast food, bold flavor, Abuja energy</h2>
            <p className="mt-3 text-brown/70">
              From sizzling burgers to loaded fries and juicy shawarma, KraveEat brings crave-worthy comfort food to South End Estate and beyond. Fresh ingredients, generous portions, delivered fast.
            </p>
          </div>
          <div className="overflow-hidden rounded-[2rem] bg-brown p-2 shadow-xl shadow-brown/20">
            <video
              src="/assets/imagewithlogo6.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="h-72 w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black text-brown">Popular Orders</h2>
          <Link href="/menu" className="text-sm font-semibold text-orange hover:text-accent-hover">
            View full menu
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((item) => (
            <div
              key={item.id}
              className={cn(
                'overflow-hidden rounded-[1.75rem] border border-brown/10 bg-white shadow-sm transition hover:shadow-warm-lg',
                !item.available && 'opacity-60'
              )}
            >
              <div className="relative h-44 w-full overflow-hidden bg-cream">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={600}
                  height={400}
                  className="h-full w-full object-cover"
                />
                {!item.available && (
                  <div className="absolute inset-0 flex items-center justify-center bg-brown/40">
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-brown">SOLD OUT</span>
                  </div>
                )}
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-brown">{item.name}</h3>
                  <span className="rounded-full bg-orange/20 px-2.5 py-1 text-sm font-semibold text-orange">
                    {formatNaira(item.price)}
                  </span>
                </div>
                <p className="text-sm text-brown/70">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleAddToCart(item.id)}
                    disabled={!item.available}
                    className={cn(
                      'flex-1 rounded-full px-4 py-2 font-semibold transition',
                      item.available
                        ? 'bg-brown text-white hover:bg-brown/90 active:scale-95'
                        : 'bg-brown/20 text-brown/40 cursor-not-allowed'
                    )}
                  >
                    {addedId === item.id ? 'Added!' : 'Add to cart'}
                  </button>
                  <a
                    href={getWhatsAppUrl(
                      `Hello KraveEat, I would like to order ${item.name}.`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-brown/20 px-3 py-2 text-sm font-semibold text-brown hover:bg-white/70"
                  >
                    Order
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-brown mb-6">Categories</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/menu?category=${encodeURIComponent(category)}`}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brown shadow-sm hover:bg-orange hover:text-brown transition"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-brown p-8 text-white text-center">
          <h2 className="text-2xl font-black">Ready to satisfy the craving?</h2>
          <p className="mt-2 text-white/80 max-w-xl mx-auto">
            Browse the full menu and add your favorites to cart. Order via WhatsApp for instant confirmation.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => router.push('/menu')}
              className="rounded-full bg-orange px-6 py-3 font-semibold text-brown hover:bg-accent-hover transition"
            >
              Browse Menu
            </button>
            <a
              href={getWhatsAppUrl('Hello KraveEat, I would like to place an order.')}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10 transition"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
