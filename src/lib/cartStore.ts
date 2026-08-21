// Petit store externe (pattern useSyncExternalStore) qui persiste le
// panier dans localStorage, sans mismatch d'hydratation SSR/client.

import { ConfiguredChichaItem } from "./types";

export type CartQuantities = Record<string, number>;

export interface CartState {
  quantities: CartQuantities;
  configuredChichas: ConfiguredChichaItem[];
}

const STORAGE_KEY = "smoak-cart";
const EMPTY_STATE: CartState = { quantities: {}, configuredChichas: [] };

type Listener = () => void;

function readFromStorage(): CartState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return EMPTY_STATE;
    const parsed = JSON.parse(stored);
    return {
      quantities: parsed.quantities ?? {},
      configuredChichas: parsed.configuredChichas ?? [],
    };
  } catch {
    return EMPTY_STATE;
  }
}

let state: CartState = readFromStorage();
const listeners = new Set<Listener>();

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function update(next: CartState) {
  state = next;
  persist();
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): CartState {
  return state;
}

export function getServerSnapshot(): CartState {
  return EMPTY_STATE;
}

export function setQuantity(productId: string, quantity: number) {
  const next = { ...state.quantities };
  if (quantity <= 0) {
    delete next[productId];
  } else {
    next[productId] = quantity;
  }
  update({ ...state, quantities: next });
}

export function addToCart(productId: string) {
  update({
    ...state,
    quantities: {
      ...state.quantities,
      [productId]: (state.quantities[productId] ?? 0) + 1,
    },
  });
}

export function removeFromCart(productId: string) {
  const current = state.quantities[productId] ?? 0;
  const next = { ...state.quantities };
  if (current <= 1) {
    delete next[productId];
  } else {
    next[productId] = current - 1;
  }
  update({ ...state, quantities: next });
}

export function addConfiguredChicha(
  item: Omit<ConfiguredChichaItem, "id">,
) {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${item.chichaId}-${Date.now()}-${Math.random()}`;
  update({
    ...state,
    configuredChichas: [...state.configuredChichas, { ...item, id }],
  });
}

export function setConfiguredChichaQuantity(id: string, quantity: number) {
  if (quantity <= 0) {
    update({
      ...state,
      configuredChichas: state.configuredChichas.filter((c) => c.id !== id),
    });
    return;
  }
  update({
    ...state,
    configuredChichas: state.configuredChichas.map((c) =>
      c.id === id ? { ...c, quantity } : c,
    ),
  });
}

export function removeConfiguredChicha(id: string) {
  update({
    ...state,
    configuredChichas: state.configuredChichas.filter((c) => c.id !== id),
  });
}

export function clearCart() {
  update(EMPTY_STATE);
}
