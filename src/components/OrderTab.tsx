"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const REVEAL_THRESHOLD = 60;

export default function OrderTab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > REVEAL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Link
      href="/commande"
      aria-label="Commander"
      style={{ writingMode: "vertical-rl" }}
      className={`fixed right-0 top-1/2 z-30 -translate-y-1/2 rounded-l-xl border border-white/10 bg-ink/70 py-5 pl-3 pr-4 text-sm font-semibold tracking-wide text-white shadow-lg backdrop-blur-xl transition-all duration-700 ease-out hover:bg-ink/85 hover:pr-6 ${
        visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      Commander
    </Link>
  );
}
