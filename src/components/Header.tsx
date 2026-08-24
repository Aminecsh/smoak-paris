"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/qui-sommes-nous", label: "Qui sommes-nous" },
  { href: "/commande", label: "Commander" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const transparent = isHome && heroVisible;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!isHome) return;

    const sentinel = document.getElementById("hero-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -80px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isHome]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          transparent
            ? "border-b border-transparent bg-transparent"
            : "border-b border-border bg-white/95 backdrop-blur"
        }`}
      >
        <div className="relative mx-auto flex h-20 max-w-6xl items-center justify-center px-4 sm:px-6">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Smoak Paris"
              width={936}
              height={491}
              priority
              className={`h-16 w-auto transition-all duration-300 sm:h-[4.5rem] ${
                transparent ? "brightness-0 invert" : ""
              }`}
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
            <span
              className={`h-0.5 w-7 rounded-full transition-all group-hover:w-8 group-hover:bg-signal ${
                transparent ? "bg-white" : "bg-ink"
              }`}
            />
            <span
              className={`h-0.5 w-5 rounded-full transition-all group-hover:w-8 group-hover:bg-signal ${
                transparent ? "bg-white" : "bg-ink"
              }`}
            />
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
        className={`fixed right-0 top-0 z-[70] flex h-full w-72 max-w-[80vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-5">
          <span className="font-serif text-lg tracking-tight text-ink">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
            className="flex h-8 w-8 items-center justify-center text-2xl leading-none text-muted transition-colors hover:text-ink"
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
              className="rounded-lg px-3 py-3 text-base font-medium text-ink/80 transition-colors hover:bg-secondary hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
