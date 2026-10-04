"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/types/cart";

type CartContextType = {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sissy-bourgeois-cart");
      if (stored) setItems(JSON.parse(stored));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("sissy-bourgeois-cart", JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    add: (item: CartItem) => setItems(current => {
      const found = current.find(x => x.id === item.id);
      if (found) return current.map(x => x.id === item.id ? { ...x, quantity: x.quantity + item.quantity } : x);
      return [...current, item];
    }),
    remove: (id: string) => setItems(current => current.filter(x => x.id !== id)),
    updateQuantity: (id: string, quantity: number) =>
      setItems(current => current.map(x => x.id === id ? { ...x, quantity: Math.max(1, quantity) } : x)),
    clear: () => setItems([])
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
