'use client';

import { useEffect, useState } from 'react';
import { uploadMenuImage } from '@/lib/supabase';

const adminPassword = 'kraveat2026';

type MenuItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  available: boolean;
  description: string;
};

const starterItems: MenuItem[] = [
  { id: 1, name: 'Classic Burger', category: 'Burger', price: 4500, available: true, description: 'Signature burger' },
  { id: 2, name: 'Chicken Shawarma', category: 'Shawarma', price: 3500, available: true, description: 'Flavorful shawarma' },
  { id: 3, name: 'Loaded Fries', category: 'Loaded Fries', price: 2800, available: true, description: 'Loaded fries' },
  { id: 4, name: 'Chicken & Chips', category: 'Chicken & Chips', price: 4200, available: true, description: 'Crispy chicken' }
];

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [items, setItems] = useState<MenuItem[]>(starterItems);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Burger');
  const [price, setPrice] = useState('4500');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('kraveat-admin-items');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('kraveat-admin-items', JSON.stringify(items));
  }, [items]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      setAuthorized(true);
    } else {
      alert('Wrong password');
    }
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let imageUrl = '';
    if (imageFile) {
      setUploading(true);
      try {
        imageUrl = (await uploadMenuImage(imageFile)) || '';
      } catch (error) {
        console.error(error);
        alert('Image upload failed. Continue with a placeholder image if Supabase is not configured.');
      } finally {
        setUploading(false);
      }
    }

    const newItem: MenuItem = {
      id: Date.now(),
      name: name.trim(),
      category,
      price: Number(price) || 0,
      available: true,
      description: description.trim()
    };
    setItems((prev) => [...prev, newItem]);
    setName('');
    setPrice('');
    setDescription('');
    setImageFile(null);
    if (imageUrl) {
      console.log('Uploaded image URL:', imageUrl);
    }
  };

  const toggleAvailability = (id: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item)));
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (!authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-4">
        <form onSubmit={handleLogin} className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange">Admin Access</p>
          <h1 className="mt-2 text-3xl font-black text-brown">KraveEat dashboard</h1>
          <p className="mt-2 text-sm text-brown/70">Use the password to access menu management.</p>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-6 w-full rounded-full border border-brown/20 bg-cream px-4 py-3" placeholder="Enter password" />
          <button className="mt-4 w-full rounded-full bg-orange px-4 py-3 font-semibold text-brown">Login</button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange">Admin dashboard</p>
            <h1 className="text-3xl font-black text-brown">Manage menu and orders</h1>
          </div>
        </div>

        <section className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={addItem} className="space-y-4 rounded-[1.75rem] bg-cream p-5">
            <h2 className="text-xl font-black text-brown">Add a new item</h2>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-full border border-brown/20 bg-white px-4 py-3" placeholder="Item name" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-full border border-brown/20 bg-white px-4 py-3">
              <option>Burger</option>
              <option>Shawarma</option>
              <option>Loaded Fries</option>
              <option>Chicken & Chips</option>
            </select>
            <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-full border border-brown/20 bg-white px-4 py-3" placeholder="Price" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-24 w-full rounded-[1.25rem] border border-brown/20 bg-white px-4 py-3" placeholder="Description" />
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full rounded-full border border-brown/20 bg-white px-4 py-3" />
            <button disabled={uploading} className="w-full rounded-full bg-brown px-4 py-3 font-semibold text-white disabled:opacity-70">{uploading ? 'Uploading...' : 'Save item'}</button>
            <p className="text-sm text-brown/70">Upload product images and update availability without touching code. Supabase storage is wired in for production use.</p>
          </form>

          <div className="space-y-4">
            <h2 className="text-xl font-black text-brown">Menu items</h2>
            {items.map((item) => (
              <div key={item.id} className="rounded-[1.5rem] border border-brown/10 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-brown">{item.name}</p>
                    <p className="text-sm text-brown/70">{item.category} • ₦{item.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleAvailability(item.id)} className={`rounded-full px-3 py-2 text-sm font-semibold ${item.available ? 'bg-orange text-brown' : 'bg-brown text-white'}`}>
                      {item.available ? 'Available' : 'Sold Out'}
                    </button>
                    <button onClick={() => removeItem(item.id)} className="rounded-full bg-cream px-3 py-2 text-sm font-semibold text-brown">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[1.75rem] bg-cream p-5">
          <h2 className="text-xl font-black text-brown">Incoming orders</h2>
          <div className="mt-4 rounded-[1.25rem] bg-white p-4">
            <p className="font-semibold text-brown">Order #001</p>
            <p className="text-sm text-brown/70">Customer: Ada • Phone: 09030707047 • Address: South End Estate</p>
            <p className="mt-2 text-sm text-brown/70">Items: Classic Burger x1, Chicken Shawarma x2</p>
          </div>
        </section>
      </div>
    </main>
  );
}
