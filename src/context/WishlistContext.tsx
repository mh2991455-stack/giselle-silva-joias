"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { WishlistItem } from "@/types/database";

interface WishlistContextValue {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  has: (id: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be inside WishlistProvider");
  return ctx;
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("giselle:favorites");
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("giselle:favorites", JSON.stringify(items));
  }, [items]);

  function toggle(item: WishlistItem) {
    setItems((prev) =>
      prev.find((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  }

  function has(id: string) {
    return items.some((i) => i.id === id);
  }

  return (
    <WishlistContext.Provider value={{ items, toggle, has, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}
