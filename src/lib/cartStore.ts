// Petit store externe (pattern useSyncExternalStore) qui persiste le
// panier dans localStorage, sans mismatch d'hydratation SSR/client.

export type CartQuantities = Record<string, number>;

const STORAGE_KEY = "smoak-cart";
const EMPTY_QUANTITIES: CartQuantities = {};

type Listener = () => void;

function readFromStorage(): CartQuantities {
  if (typeof window === "undefined") return EMPTY_QUANTITIES;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : EMPTY_QUANTITIES;
  } catch {
    return EMPTY_QUANTITIES;
  }
}

let quantities: CartQuantities = readFromStorage();
const listeners = new Set<Listener>();

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quantities));
}

function update(next: CartQuantities) {
  quantities = next;
  persist();
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): CartQuantities {
  return quantities;
}

export function getServerSnapshot(): CartQuantities {
  return EMPTY_QUANTITIES;
}

export function setQuantity(productId: string, quantity: number) {
  const next = { ...quantities };
  if (quantity <= 0) {
    delete next[productId];
  } else {
    next[productId] = quantity;
  }
  update(next);
}

export function addToCart(productId: string) {
  update({ ...quantities, [productId]: (quantities[productId] ?? 0) + 1 });
}

export function removeFromCart(productId: string) {
  const current = quantities[productId] ?? 0;
  const next = { ...quantities };
  if (current <= 1) {
    delete next[productId];
  } else {
    next[productId] = current - 1;
  }
  update(next);
}

export function clearCart() {
  update({});
}
