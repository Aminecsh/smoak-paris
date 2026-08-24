"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrderTab() {
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    const sentinel = document.getElementById("hero-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setOverHero(!entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -80px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      href="/commande"
      aria-label="Commander"
      className={`fixed bottom-6 right-6 z-30 rounded-full border px-8 py-3 text-sm font-semibold shadow-lg backdrop-blur-xl transition-colors duration-500 sm:bottom-10 sm:right-10 ${
        overHero
          ? "border-white/30 bg-white/15 text-white hover:bg-white/25"
          : "border-white/10 bg-ink/70 text-white hover:bg-ink/85"
      }`}
    >
      Commander
    </Link>
  );
}
