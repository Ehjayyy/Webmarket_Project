/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "../types/models";

export type CartItem = {
  product: Product;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: number) => void;
  setQty: (productId: number, qty: number) => void;
  clearCart: () => void;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, qty = 1) => {
    if (product.stock <= 0) return;

    setItems((prev) => {
      const existing = prev.find((x) => x.product.id === product.id);
      if (!existing) return [...prev, { product, qty: Math.min(qty, product.stock) }];

      return prev.map((x) =>
        x.product.id === product.id
          ? { ...x, qty: Math.min(x.qty + qty, x.product.stock) }
          : x
      );
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => prev.filter((x) => x.product.id !== productId));
  };

  const setQty = (productId: number, qty: number) => {
    setItems((prev) =>
      prev
        .map((x) =>
          x.product.id === productId
            ? { ...x, qty: Math.max(1, Math.min(qty, x.product.stock)) }
            : x
        )
        .filter((x) => x.qty > 0)
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, x) => sum + x.product.price * x.qty, 0);
  }, [items]);

  const value: CartContextValue = {
    items,
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}