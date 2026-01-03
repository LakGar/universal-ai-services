"use client";

import * as React from "react";

export interface CartAddOn {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string | number;
  cartItemId: string; // Unique identifier for this specific cart item (product + config + add-ons)
  name: string;
  image: string;
  price: string;
  quantity: number;
  addOns?: CartAddOn[];
  selectedConfig?: string;
  isRent?: boolean; // Flag to indicate if this is a rental item
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity" | "cartItemId">) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);

  const addItem = React.useCallback((item: Omit<CartItem, "quantity" | "cartItemId">) => {
    setItems((prev) => {
      // Create a unique cart item ID based on product ID, config, and add-ons
      const addOnsKey = item.addOns?.map(a => a.id).sort().join(',') || '';
      const cartItemId = `${String(item.id)}-${item.selectedConfig || 'default'}-${addOnsKey}`;
      
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, cartItemId, quantity: 1 }];
    });
  }, []);

  const removeItem = React.useCallback((cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }, []);

  const updateQuantity = React.useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity } : item))
    );
  }, [removeItem]);

  const clearCart = React.useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = React.useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value = React.useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

