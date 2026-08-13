'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { uploadMenuImage } from '@/lib/supabase';
import { products as initialProducts, Product } from '@/lib/products';
import { cn, formatNaira } from '@/lib/utils';

type AdminItem = Product & { available: boolean };

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('kraveat-admin-authorized') === 'true';
  });
  const [items, setItems] = useState<AdminItem[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Burger');
  const [price, setPrice] = useState('4500');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [orders, setOrders] = useState<{ id: string; customerName: string; customerPhone: string; customerAddress: string; items: string; total: number; status: string }[]>([]);

  const loadItems = useCallback(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('kraveat-admin-items');
    if (stored) {
      setItems(JSON.parse(stored));
    } else {
      setItems(
        initialProducts.map((p) => ({
          ...p,
          available: true,
        })),
      );
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/verify');
        if (response.ok) {
          setAuthorized(true);
          loadItems();
        } else {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router, loadItems]);

  useEffect(() => {
    if (!authorized) return;
    window.localStorage.setItem('kraveat-admin-items', JSON.stringify(items));
  }, [items, authorized]);

  useEffect(() => {
    if (!authorized) return;
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/admin/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
        }
      } catch {
        // ignore
      }
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [authorized]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let imageUrl = '';
    if (imageFile) {
      setUploading(true);
      try {
        imageUrl = (await uploadMenuImage(imageFile)) || '';
      } catch {
        alert('Image upload failed. Saving without image.');
      } finally {
        setUploading(false);
      }
    }

    const newItem: AdminItem = {
      id: Date.now(),
      name: name.trim(),
      category,
      price: Number(price) || 0,
      available: true,
      description: description.trim() || '',
      image: imageUrl || '/assets/imagewithlogo1.png',
      featured: false,
      popular: false,
    };

    setItems((prev) => [...prev, newItem]);
    setName('');
    setCategory('Burger');
    setPrice('4500');
    setDescription('');
    setImageFile(null);
  };

  const toggleAvailability = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item,
      ),
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order,
        ),
      );
    } catch {
      // ignore
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/');
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-lg font-semibold text-brown">Loading...</p>
      </main>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange">Admin dashboard</p>
            <h1 className="text-3xl font-black text-brown">Manage menu and orders</h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-brown/20 px-4 py-2 text-sm font-semibold text-brown hover:bg-white/70 transition"
          >
            Logout
          </button>
        </div>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={handleAddItem} className="space-y-4 rounded-[1.75rem] bg-cream p-5">
            <h2 className="text-xl font-black text-brown">Add a new item</h2>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-full border border-brown/20 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
              placeholder="Item name"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-full border border-brown/20 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
            >
              <option>Burger</option>
              <option>Shawarma</option>
              <option>Loaded Fries</option>
              <option>Chicken & Chips</option>
            </select>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-full border border-brown/20 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
              placeholder="Price"
              type="number"
              min="0"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 w-full rounded-[1.25rem] border border-brown/20 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
              placeholder="Description"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full rounded-full border border-brown/20 bg-white px-4 py-3"
            />
            <button
              disabled={uploading}
              className="w-full rounded-full bg-brown px-4 py-3 font-semibold text-white disabled:opacity-70 hover:bg-brown/90 transition"
            >
              {uploading ? 'Uploading...' : 'Save item'}
            </button>
          </form>

          <div className="space-y-4">
            <h2 className="text-xl font-black text-brown">Menu items</h2>
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-[1.5rem] border border-brown/10 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-brown">{item.name}</p>
                    <p className="text-sm text-brown/70">
                      {item.category} • {formatNaira(item.price)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={cn(
                        'rounded-full px-3 py-2 text-sm font-semibold transition',
                        item.available ? 'bg-orange text-brown hover:bg-accent-hover' : 'bg-brown text-white hover:bg-brown/90'
                      )}
                    >
                      {item.available ? 'Available' : 'Sold Out'}
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="rounded-full bg-cream px-3 py-2 text-sm font-semibold text-brown hover:bg-brown/10 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-cream p-5">
          <h2 className="text-xl font-black text-brown">Incoming orders</h2>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-brown/70">No orders yet. Orders will appear here after customers submit via WhatsApp.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-[1.25rem] bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-brown">Order #{order.id.slice(-6)}</p>
                    <span className="rounded-full bg-orange/20 px-2.5 py-1 text-xs font-semibold text-orange uppercase tracking-wider">
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-brown/70">
                    Customer: {order.customerName} • Phone: {order.customerPhone} • Address: {order.customerAddress}
                  </p>
                  <p className="mt-2 text-sm text-brown/70">
                    Items: {order.items}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-brown">Total: {formatNaira(order.total)}</p>
                  <div className="mt-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="rounded-full border border-brown/20 bg-cream px-3 py-2 text-sm font-semibold text-brown focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
                    >
                      <option>NEW</option>
                      <option>CONFIRMED</option>
                      <option>PREPARING</option>
                      <option>READY</option>
                      <option>OUT FOR DELIVERY</option>
                      <option>COMPLETED</option>
                      <option>CANCELLED</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
