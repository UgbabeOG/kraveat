'use client';

import { createContext, useContext, ReactNode, useSyncExternalStore } from 'react';
import { Product } from './products';
import { formatNaira } from './utils';

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_STORAGE_KEY = 'kraveat-cart';

let cachedServerSnapshot: CartItem[] = [];
let cachedClientSnapshot: CartItem[] = [];
let clientSnapshotInitialized = false;
const cartListeners = new Set<() => void>();

function getCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return cachedServerSnapshot;
  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as CartItem[];
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // ignore corrupted storage
  }
  return cachedClientSnapshot;
}

function getClientSnapshot() {
  if (!clientSnapshotInitialized) {
    cachedClientSnapshot = getCartFromStorage();
    clientSnapshotInitialized = true;
  }
  return cachedClientSnapshot;
}

function subscribeToCart(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const handleStorage = (event: StorageEvent) => {
    if (event.key === CART_STORAGE_KEY) {
      cachedClientSnapshot = getCartFromStorage();
      clientSnapshotInitialized = true;
      callback();
    }
  };
  cartListeners.add(callback);
  window.addEventListener('storage', handleStorage);
  return () => {
    cartListeners.delete(callback);
    window.removeEventListener('storage', handleStorage);
  };
}

function setCart(items: CartItem[]) {
  cachedClientSnapshot = items;
  clientSnapshotInitialized = true;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  cartListeners.forEach((listener) => listener());
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribeToCart, getClientSnapshot, () => cachedServerSnapshot);

  const addToCart = (product: Product) => {
    const current = [...getCartFromStorage()];
    const existing = current.find((item) => item.product.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      current.push({ product, quantity: 1 });
    }
    setCart(current);
  };

  const removeFromCart = (productId: number) => {
    const current = getCartFromStorage().filter((item) => item.product.id !== productId);
    setCart(current);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const current = [...getCartFromStorage()];
    const item = current.find((i) => i.product.id === productId);
    if (item) {
      item.quantity = quantity;
      setCart(current);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
