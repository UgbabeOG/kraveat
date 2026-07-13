'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

async function notifyAdmin(summary: string) {
  await fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ summary })
  });
}

const cartItems = [
  { id: 1, name: 'Classic Burger', quantity: 1, price: 4500 },
  { id: 2, name: 'Chicken Shawarma', quantity: 2, price: 3500 }
];

export default function CheckoutPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const total = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0), []);

  const handleOrder = async () => {
    const summary = `New KraveEat order\nCustomer: ${name}\nPhone: ${phone}\nAddress: ${address}\nItems: ${cartItems.map((item) => `${item.name} x${item.quantity}`).join(', ')}\nTotal: ₦${total.toLocaleString()}`;

    await notifyAdmin(summary);
    const encoded = encodeURIComponent(summary);
    window.open(`https://wa.me/2349030707047?text=${encoded}`, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange">Checkout</p>
          <h1 className="mt-2 text-3xl font-black text-brown">Your order</h1>
          <div className="mt-6 space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl bg-cream p-3">
                <div>
                  <p className="font-semibold text-brown">{item.name}</p>
                  <p className="text-sm text-brown/70">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-brown">₦{(item.quantity * item.price).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-brown p-4 text-white">
            <div className="flex items-center justify-between">
              <span>Total</span>
              <span className="text-2xl font-black">₦{total.toLocaleString()}</span>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-brown">Customer details</h2>
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-semibold text-brown">
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-full border border-brown/20 bg-cream px-4 py-3" placeholder="Your name" />
            </label>
            <label className="block text-sm font-semibold text-brown">
              Phone
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 w-full rounded-full border border-brown/20 bg-cream px-4 py-3" placeholder="0903..." />
            </label>
            <label className="block text-sm font-semibold text-brown">
              Address
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="mt-2 min-h-24 w-full rounded-[1.25rem] border border-brown/20 bg-cream px-4 py-3" placeholder="Delivery address" />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={handleOrder} className="rounded-full bg-orange px-5 py-3 font-semibold text-brown">Place order</button>
            <Link href="/menu" className="rounded-full border border-brown/20 px-5 py-3 font-semibold text-brown">Back to menu</Link>
          </div>
          {submitted ? <p className="mt-4 text-sm font-semibold text-orange">Your order summary is ready on WhatsApp.</p> : null}
        </section>
      </div>
    </main>
  );
}
