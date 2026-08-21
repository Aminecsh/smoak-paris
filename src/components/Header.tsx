"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-20 border-b border-brand/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/commande"
          className="hidden text-xs font-semibold uppercase tracking-[0.15em] text-brand/70 transition-colors hover:text-brand sm:inline"
        >
          Menu
        </Link>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl font-semibold tracking-tight text-brand"
        >
          Smoak <span className="italic">Paris</span>
        </Link>

        <Link
          href="/commande"
          className="relative ml-auto flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-brand-soft"
        >
          Commander
          {totalItems > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-brand">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
