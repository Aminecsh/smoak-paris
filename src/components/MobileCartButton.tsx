"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import CartPanel from "@/components/CartPanel";

export default function MobileCartButton() {
  const { totalItems, totalPrice } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (totalItems === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Voir le panier (${totalItems} article${totalItems > 1 ? "s" : ""})`}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-white/10 bg-ink/80 py-3 pl-4 pr-5 text-white shadow-lg backdrop-blur-xl transition-colors hover:bg-ink/90 lg:hidden"
      >
        <span className="relative flex h-6 w-6 items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.5 3h1.6l1.2 12.2a2 2 0 0 0 2 1.8h9.8a2 2 0 0 0 2-1.7l1.2-8.3H5.1"
            />
            <circle cx="9.5" cy="20" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="17" cy="20" r="1.4" fill="currentColor" stroke="none" />
          </svg>
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 font-mono text-[10px] font-bold text-ink">
            {totalItems}
          </span>
        </span>
        <span className="font-mono text-sm font-semibold">{totalPrice.toFixed(2)} €</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative flex max-h-[85vh] w-full flex-col overflow-y-auto rounded-t-2xl bg-white p-5 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-1 flex justify-center">
              <span className="h-1 w-10 rounded-full bg-border" />
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le panier"
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-secondary hover:text-ink"
            >
              ✕
            </button>
            <CartPanel />
          </div>
        </div>
      )}
    </>
  );
}
