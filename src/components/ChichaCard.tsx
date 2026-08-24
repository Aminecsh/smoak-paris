"use client";

import Image from "next/image";
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
      className="group relative flex aspect-[4/5] w-full flex-col overflow-hidden rounded-2xl text-left transition-transform hover:-translate-y-0.5 sm:aspect-square"
    >
      {chicha.image && (
        <Image
          src={chicha.image}
          alt=""
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

      <div className="relative mt-auto flex flex-1 flex-col justify-end p-6">
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/20 font-serif text-base font-semibold text-white backdrop-blur-sm">
            {chicha.name.charAt(0)}
          </span>
          <span className="font-mono text-sm font-semibold text-white">
            dès {chicha.price.toFixed(2)} €
          </span>
        </div>

        <h3 className="mt-4 font-serif text-xl font-semibold text-white">
          {chicha.name}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-white/70">
          {chicha.description}
        </p>

        <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-ink transition-colors group-hover:bg-white/90">
          Composer ma chicha
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </button>
  );
}
