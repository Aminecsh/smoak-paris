"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
}

const LOW_STOCK_THRESHOLD = 10;

function StockRow({ item }: { item: StockItem }) {
  const [savedQuantity, setSavedQuantity] = useState(item.quantity);
  const [value, setValue] = useState(item.quantity);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const dirty = value !== savedQuantity;

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/stock/adjust", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, quantity: value }),
    });
    setSaving(false);
    if (res.ok) {
      setSavedQuantity(value);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }
  };

  const isLow = savedQuantity <= LOW_STOCK_THRESHOLD;

  return (
    <li
      className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-sm ${
        isLow ? "border-amber-300 bg-amber-50" : "border-border"
      }`}
    >
      <span className="min-w-0 flex-1 truncate text-ink">
        {item.name}
        {isLow && (
          <span className="ml-2 rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
            Stock bas
          </span>
        )}
      </span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => setValue(Math.max(0, Number(e.target.value)))}
        className="w-20 flex-shrink-0 rounded-md border border-border bg-white px-2 py-1 text-center text-sm text-ink"
      />
      <button
        type="button"
        onClick={handleSave}
        disabled={!dirty || saving}
        className="flex-shrink-0 rounded-full bg-signal px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white hover:bg-signal-hover disabled:opacity-40"
      >
        {saving ? "..." : saved ? "✓" : "Enregistrer"}
      </button>
    </li>
  );
}

export default function StockDashboard({ items }: { items: StockItem[] }) {
  const router = useRouter();
  const categories = Array.from(new Set(items.map((i) => i.category)));

  const handleLogout = async () => {
    await fetch("/api/stock/logout", { method: "POST" });
    router.refresh();
  };

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink">
            Stocks
          </h1>
          <p className="mt-1 text-sm text-muted">
            Décompté automatiquement à chaque commande.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="text-xs font-medium text-muted hover:text-ink"
        >
          Déconnexion
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-8">
        {categories.map((category) => (
          <section key={category}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
              {category}
            </h2>
            <ul className="flex flex-col gap-2">
              {items
                .filter((i) => i.category === category)
                .map((item) => (
                  <StockRow key={item.id} item={item} />
                ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
