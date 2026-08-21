"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  ReactNode,
} from "react";
import { products } from "@/lib/products";
import * as cartStore from "@/lib/cartStore";

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  getQuantity: (productId: string) => number;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const quantities = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );

  const items = useMemo<CartItem[]>(
    () =>
      Object.entries(quantities).map(([productId, quantity]) => ({
        productId,
        quantity,
      })),
    [quantities],
  );

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () =>
      items.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.productId);
        return product ? sum + product.price * item.quantity : sum;
      }, 0),
    [items],
  );

  const value: CartContextValue = {
    items,
    totalItems,
    totalPrice,
    getQuantity: (productId) => quantities[productId] ?? 0,
    addToCart: cartStore.addToCart,
    removeFromCart: cartStore.removeFromCart,
    setQuantity: cartStore.setQuantity,
    clearCart: cartStore.clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
