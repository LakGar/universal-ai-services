"use client";

import * as React from "react";

interface WishlistItem {
  id: number;
  name: string;
  image: string;
  price: string;
  monthlyPrice?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  itemCount: number;
}

const WishlistContext = React.createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<WishlistItem[]>([]);

  const addItem = React.useCallback((item: WishlistItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev; // Already in wishlist
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = React.useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const isInWishlist = React.useCallback(
    (id: number) => {
      return items.some((item) => item.id === id);
    },
    [items]
  );

  const itemCount = React.useMemo(() => items.length, [items]);

  const value = React.useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      isInWishlist,
      itemCount,
    }),
    [items, addItem, removeItem, isInWishlist, itemCount]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = React.useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

