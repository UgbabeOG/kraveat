'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { generateWhatsAppOrderMessage, getWhatsAppUrl } from '@/lib/whatsapp';
import { validateNigerianPhone, formatNaira, cn } from '@/lib/utils';

type FieldErrors = {
  name?: string;
  phone?: string;
  address?: string;
};

export default function CheckoutPage() {
  const { items, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const subtotal = cartTotal;
  const itemCount = cartCount;

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (!name.trim() || name.trim().length < 2) errs.name = 'Please enter your full name.';
    if (!phone.trim()) errs.phone = 'Please enter your phone number.';
    else if (!validateNigerianPhone(phone)) errs.phone = 'Enter a valid Nigerian number (e.g. 0903 070 7047).';
    if (!address.trim() || address.trim().length < 5) errs.address = 'Please enter your delivery address.';
    return errs;
  };

  const handleOrder = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const payload = {
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerAddress: address.trim(),
        items: items.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
        total: subtotal,
      };

      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const message = generateWhatsAppOrderMessage({
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerAddress: address.trim(),
        items,
      });

      const whatsappUrl = getWhatsAppUrl(message);
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      clearCart();
      setSubmitted(true);
    } catch {
      setErrors({ phone: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-8 shadow-sm text-center">
          <p className="text-4xl mb-4">🎉</p>
          <h1 className="text-3xl font-black text-brown">Order sent!</h1>
          <p className="mt-2 text-brown/70">Your order summary is ready on WhatsApp. KraveEat will confirm shortly.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/menu" className="rounded-full bg-brown px-5 py-3 font-semibold text-white hover:bg-brown/90 transition">
              Order more
            </Link>
            <a
              href={getWhatsAppUrl('Hello KraveEat, I just placed an order. Can you confirm?')}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-brown/20 px-5 py-3 font-semibold text-brown hover:bg-white/70 transition"
            >
              Open WhatsApp
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange">Checkout</p>
          <h1 className="mt-2 text-3xl font-black text-brown">Your order</h1>

          {items.length === 0 ? (
            <div className="mt-8 text-center">
              <p className="text-lg font-semibold text-brown">Your cart is empty</p>
              <p className="mt-2 text-sm text-brown/70">Add some delicious items from the menu first.</p>
              <Link href="/menu" className="mt-4 inline-block rounded-full bg-brown px-5 py-3 font-semibold text-white hover:bg-brown/90 transition">
                Browse menu
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-6 space-y-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between rounded-2xl bg-cream p-3">
                    <div className="flex-1">
                      <p className="font-semibold text-brown">{item.product.name}</p>
                      <p className="text-sm text-brown/70">{formatNaira(item.product.price)} each</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brown shadow-sm hover:bg-brown/5 transition"
                          aria-label={`Decrease quantity of ${item.product.name}`}
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-brown">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brown shadow-sm hover:bg-brown/5 transition"
                          aria-label={`Increase quantity of ${item.product.name}`}
                        >
                          +
                        </button>
                      </div>
                      <span className="w-20 text-right text-sm font-semibold text-brown">
                        {formatNaira(item.product.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-brown/40 hover:text-danger transition"
                        aria-label={`Remove ${item.product.name} from cart`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-brown p-4 text-white">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                  <span className="text-2xl font-black">{formatNaira(subtotal)}</span>
                </div>
              </div>
            </>
          )}
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-brown">Customer details</h2>
          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-brown">
                Full name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(
                  'mt-2 w-full rounded-full border bg-cream px-4 py-3 text-brown focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2',
                  errors.name ? 'border-danger' : 'border-brown/20'
                )}
                placeholder="Your name"
              />
              {errors.name && <p className="mt-1 text-sm text-danger">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-brown">
                Phone number
              </label>
              <input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={cn(
                  'mt-2 w-full rounded-full border bg-cream px-4 py-3 text-brown focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2',
                  errors.phone ? 'border-danger' : 'border-brown/20'
                )}
                placeholder="0903 070 7047"
              />
              {errors.phone && <p className="mt-1 text-sm text-danger">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-brown">
                Delivery address
              </label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={cn(
                  'mt-2 min-h-24 w-full rounded-[1.25rem] border bg-cream px-4 py-3 text-brown focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2',
                  errors.address ? 'border-danger' : 'border-brown/20'
                )}
                placeholder="South End Estate, plot 12..."
              />
              {errors.address && <p className="mt-1 text-sm text-danger">{errors.address}</p>}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleOrder}
              disabled={loading || items.length === 0}
              className="rounded-full bg-orange px-5 py-3 font-semibold text-brown hover:bg-accent-hover transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send order on WhatsApp'}
            </button>
            <Link href="/menu" className="rounded-full border border-brown/20 px-5 py-3 font-semibold text-brown hover:bg-white/70 transition">
              Back to menu
            </Link>
          </div>
          {submitted && (
            <p className="mt-4 text-sm font-semibold text-orange">Your order summary is ready on WhatsApp.</p>
          )}
        </section>
      </div>
    </main>
  );
}
