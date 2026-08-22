"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-20 border-b border-brand/10 bg-white/95 backdrop-blur">
      <div className="mx-auto grid h-20 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:px-6">
        <Link
          href="/commande"
          className="hidden text-xs font-semibold uppercase tracking-[0.15em] text-brand/70 transition-colors hover:text-brand sm:inline"
        >
          Menu
        </Link>

        <Link href="/" className="justify-self-center">
          <Image
            src="/logo.png"
            alt="Smoak Paris"
            width={936}
            height={491}
            priority
            className="h-10 w-auto sm:h-12"
          />
        </Link>

        <Link
          href="/commande"
          className="flex items-center gap-2 justify-self-end rounded-full bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-brand-soft sm:px-5 sm:py-2.5"
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
