"use client";

import { ChichaBase } from "@/lib/types";

export default function ChichaCard({
  chicha,
  onSelect,
}: {
  chicha: ChichaBase;
  onSelect: (chichaId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(chicha.id)}
      className="flex w-full items-start gap-4 rounded-xl border border-brand/10 bg-cream p-4 text-left transition-colors hover:border-brand/30"
    >
      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-white text-2xl">
        {chicha.emoji}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif font-semibold text-brand">{chicha.name}</h3>
          <span className="flex-shrink-0 font-mono text-sm text-brand/70">
            dès {chicha.price.toFixed(2)} €
          </span>
        </div>
        <p className="mt-1 text-sm text-brand/60">{chicha.description}</p>

        <span className="mt-3 inline-block rounded-full border border-brand/20 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-brand transition-colors">
          Composer
        </span>
      </div>
    </button>
  );
}
