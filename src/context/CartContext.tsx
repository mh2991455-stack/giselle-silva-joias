"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { CartItem } from "@/types/database";

interface CartContextValue {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">) => void;
  remove: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
  isOpen: boolean;
  setOpen: (v: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("giselle:cart");
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("giselle:cart", JSON.stringify(items));
  }, [items]);

  function add(item: Omit<CartItem, "quantity">) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setOpen(true);
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQty(id: string, qty: number) {
    if (qty <= 0) return remove(id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
  }

  function clear() {
    setItems([]);
  }

  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const count = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, updateQty, clear, total, count, isOpen, setOpen }}>
      {children}
    </CartContext.Provider>
  );
}
