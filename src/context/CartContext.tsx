"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  ReactNode,
} from "react";
import { products } from "@/lib/products";
import { ConfiguredChichaItem } from "@/lib/types";
import * as cartStore from "@/lib/cartStore";

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  configuredChichas: ConfiguredChichaItem[];
  totalItems: number;
  totalPrice: number;
  getQuantity: (productId: string) => number;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  addConfiguredChicha: (item: Omit<ConfiguredChichaItem, "id">) => void;
  setConfiguredChichaQuantity: (id: string, quantity: number) => void;
  removeConfiguredChicha: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
  const { quantities, configuredChichas } = state;

  const items = useMemo<CartItem[]>(
    () =>
      Object.entries(quantities)
        .filter(([productId]) => products.some((p) => p.id === productId))
        .map(([productId, quantity]) => ({ productId, quantity })),
    [quantities],
  );

  const totalItems = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.quantity, 0) +
      configuredChichas.reduce((sum, c) => sum + c.quantity, 0),
    [items, configuredChichas],
  );

  const totalPrice = useMemo(
    () =>
      items.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.productId);
        return product ? sum + product.price * item.quantity : sum;
      }, 0) +
      configuredChichas.reduce(
        (sum, c) => sum + c.unitPrice * c.quantity,
        0,
      ),
    [items, configuredChichas],
  );

  const value: CartContextValue = {
    items,
    configuredChichas,
    totalItems,
    totalPrice,
    getQuantity: (productId) => quantities[productId] ?? 0,
    addToCart: cartStore.addToCart,
    removeFromCart: cartStore.removeFromCart,
    setQuantity: cartStore.setQuantity,
    addConfiguredChicha: cartStore.addConfiguredChicha,
    setConfiguredChichaQuantity: cartStore.setConfiguredChichaQuantity,
    removeConfiguredChicha: cartStore.removeConfiguredChicha,
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
