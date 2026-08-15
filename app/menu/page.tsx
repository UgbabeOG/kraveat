'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { useCart } from '@/lib/cart';
import { products, categories } from '@/lib/products';
import { formatNaira, cn } from '@/lib/utils';
import { getWhatsAppUrl } from '@/lib/whatsapp';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState(() => {
    if (typeof window === 'undefined') return 'All';
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    if (category && categories.includes(category)) {
      return category;
    }
    return 'All';
  });
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<number | null>(null);

  const allCategories = ['All', ...categories];

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const handleAddToCart = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (product && product.available) {
      addToCart(product);
      setAddedId(productId);
      setTimeout(() => setAddedId(null), 1200);
    }
  };

  return (
    <main className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange">Menu</p>
          <h1 className="text-3xl font-black text-brown">KraveEat favorites</h1>
        </div>
        <Link href="/checkout" className="rounded-full bg-brown px-4 py-2 font-semibold text-white hover:bg-brown/90 transition">
          Checkout
        </Link>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              'whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition',
              activeCategory === category
                ? 'bg-orange text-brown'
                : 'bg-white text-brown/80 hover:bg-white/70'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <section className="mx-auto mt-8 grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-4">
        {filteredItems.length === 0 && (
          <div className="col-span-full rounded-[1.75rem] bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-brown">No products found</p>
            <p className="mt-2 text-sm text-brown/70">Try selecting a different category.</p>
          </div>
        )}
        {filteredItems.map((item) => (
          <article
            key={item.id}
            className={cn(
              'overflow-hidden rounded-[1.75rem] bg-white shadow-sm transition hover:shadow-warm-lg',
              !item.available && 'opacity-60'
            )}
          >
            <div className="relative h-40 w-full overflow-hidden bg-cream sm:h-44 md:h-48">
              <Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="absolute inset-0 object-cover object-center" />
              {!item.available && (
                <div className="absolute inset-0 flex items-center justify-center bg-brown/40">
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-brown">SOLD OUT</span>
                </div>
              )}
            </div>
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-brown">{item.name}</h2>
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
                    'flex-1 rounded-full px-4 py-2 text-sm font-semibold transition',
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
          </article>
        ))}
      </section>
    </main>
  );
}
