"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

const KEY = "haquemart_wishlist";

interface WishlistContextValue {
  ids: Set<string>;
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setIds(new Set(JSON.parse(stored) as string[]));
    } catch {}
  }, []);

  function toggle(productId: string) {
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      localStorage.setItem(KEY, JSON.stringify([...next]));
      return next;
    });
  }

  return (
    <WishlistContext.Provider value={{ ids, toggle, has: (id) => ids.has(id) }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
