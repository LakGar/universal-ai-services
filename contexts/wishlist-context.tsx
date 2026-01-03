"use client";

import * as React from "react";
import { logger } from "@/lib/logger";

interface WishlistItem {
  id: string | number;
  name: string;
  image: string;
  price: string;
  monthlyPrice?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string | number) => void;
  isInWishlist: (id: string | number) => boolean;
  itemCount: number;
}

const WishlistContext = React.createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "wishlist-items";

// Load wishlist from localStorage
const loadWishlistFromStorage = (): WishlistItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    logger.error("Failed to load wishlist from localStorage", error instanceof Error ? error : new Error(String(error)));
  }
  return [];
};

// Save wishlist to localStorage
const saveWishlistToStorage = (items: WishlistItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    logger.error("Failed to save wishlist to localStorage", error instanceof Error ? error : new Error(String(error)));
  }
};

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<WishlistItem[]>([]);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Load wishlist from localStorage on mount
  React.useEffect(() => {
    const loadedItems = loadWishlistFromStorage();
    setItems(loadedItems);
    setIsInitialized(true);
  }, []);

  // Save wishlist to localStorage whenever it changes
  React.useEffect(() => {
    if (isInitialized) {
      saveWishlistToStorage(items);
    }
  }, [items, isInitialized]);

  const addItem = React.useCallback((item: WishlistItem) => {
    setItems((prev) => {
      // Use string comparison to handle both string and number IDs
      const existing = prev.find((i) => String(i.id) === String(item.id));
      if (existing) {
        return prev; // Already in wishlist
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = React.useCallback((id: string | number) => {
    setItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
  }, []);

  const isInWishlist = React.useCallback(
    (id: string | number) => {
      return items.some((item) => String(item.id) === String(id));
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

