"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/qui-sommes-nous", label: "Qui sommes-nous" },
  { href: "/commande", label: "Commander" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/60 backdrop-blur-xl">
        <div className="relative mx-auto flex h-20 max-w-6xl items-center justify-center px-4 sm:px-6">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Smoak Paris"
              width={936}
              height={491}
              priority
              className="h-16 w-auto brightness-0 invert sm:h-[4.5rem]"
            />
          </Link>
        </div>

        <div className="absolute right-4 top-0 flex h-20 items-center sm:right-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            className="group flex flex-col items-end gap-1.5 p-3"
          >
            <span className="h-0.5 w-7 rounded-full bg-white transition-all group-hover:w-8 group-hover:opacity-70" />
            <span className="h-0.5 w-5 rounded-full bg-white transition-all group-hover:w-8 group-hover:opacity-70" />
          </button>
        </div>
      </header>

      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-ink/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-hidden={!open}
        className={`fixed right-4 top-4 bottom-4 z-[70] flex w-72 max-w-[80vw] flex-col rounded-2xl border border-white/10 bg-ink/80 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out ${
          open
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-8 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <span className="font-serif text-lg tracking-tight text-white">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
            className="flex h-8 w-8 items-center justify-center text-2xl leading-none text-white/60 transition-colors hover:text-white"
          >
            ×
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
