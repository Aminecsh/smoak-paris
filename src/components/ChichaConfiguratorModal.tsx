"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { chichaFlavors, rechargeSupplement } from "@/lib/chicha";
import { ChichaBase, ChichaFlavor } from "@/lib/types";
import { useCart } from "@/context/CartContext";

function FlavorGrid({
  selectedId,
  onSelect,
  name,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  name: string;
}) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-3">
      {chichaFlavors.map((flavor: ChichaFlavor) => (
        <label
          key={flavor.id}
          className={`group flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-white transition-colors ${
            selectedId === flavor.id
              ? "border-signal ring-1 ring-signal"
              : "border-border hover:border-signal/40"
          }`}
        >
          <div className="relative aspect-square overflow-hidden bg-secondary">
            <Image
              src={flavor.image}
              alt={flavor.name}
              width={300}
              height={300}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <input
              type="radio"
              name={name}
              value={flavor.id}
              checked={selectedId === flavor.id}
              onChange={() => onSelect(flavor.id)}
              className="absolute right-2 top-2 h-5 w-5 accent-signal"
            />
          </div>
          <span className="p-3 text-center font-serif font-semibold text-ink">
            {flavor.name}
          </span>
        </label>
      ))}
    </div>
  );
}

function updateAt<T>(arr: T[], index: number, value: T): T[] {
  const next = [...arr];
  next[index] = value;
  return next;
}

export default function ChichaConfiguratorModal({
  chicha,
  onClose,
}: {
  chicha: ChichaBase;
  onClose: () => void;
}) {
  const { addConfiguredChicha } = useCart();
  const totalSteps = chicha.chichaCount;
  const stepLabels =
    totalSteps > 1 ? Array.from({ length: totalSteps }, (_, i) => `Chicha ${i + 1}`) : [];

  const [step, setStep] = useState(1);
  const [flavorIds, setFlavorIds] = useState<string[]>(
    Array(totalSteps).fill(chichaFlavors[0].id),
  );
  const [recharge, setRecharge] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const unitPrice = chicha.price + (recharge ? rechargeSupplement.price : 0);

  const handleAdd = () => {
    const flavors = flavorIds.map((id) => chichaFlavors.find((f) => f.id === id)!);

    addConfiguredChicha({
      chichaId: chicha.id,
      chichaName: chicha.name,
      chichaEmoji: chicha.emoji,
      flavorId: flavors[0].id,
      flavorName: flavors[0].name,
      secondFlavorId: flavors[1]?.id,
      secondFlavorName: flavors[1]?.name,
      thirdFlavorId: flavors[2]?.id,
      thirdFlavorName: flavors[2]?.name,
      recharge,
      drinks: [],
      sweets: [],
      unitPrice,
      quantity,
    });

    setJustAdded(true);
    setTimeout(onClose, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white sm:max-w-lg sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-ink font-serif text-lg font-semibold text-white">
              {chicha.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-ink">
                {chicha.name}
              </h2>
              <p className="text-sm text-muted">{chicha.description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-muted hover:bg-secondary hover:text-ink"
          >
            ✕
          </button>
        </div>

        {totalSteps > 1 && (
          <div className="flex items-center gap-2 border-b border-border px-5 py-3">
            {stepLabels.map((label, i) => {
              const n = i + 1;
              return (
                <div key={label} className="flex flex-1 items-center gap-2">
                  <span
                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      n === step
                        ? "bg-signal text-white"
                        : n < step
                          ? "bg-ink text-white"
                          : "bg-secondary text-muted"
                    }`}
                  >
                    {n < step ? "✓" : n}
                  </span>
                  <span
                    className={`text-xs font-semibold uppercase tracking-[0.08em] ${
                      n === step ? "text-ink" : "text-muted"
                    }`}
                  >
                    {label}
                  </span>
                  {n < stepLabels.length && (
                    <span className="h-px flex-1 bg-border" aria-hidden="true" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
              {totalSteps > 1 ? `Chicha ${step} — Goût` : "Choix du goût "}
              {totalSteps === 1 && <span className="text-muted">— obligatoire</span>}
            </h3>
            <FlavorGrid
              selectedId={flavorIds[step - 1]}
              onSelect={(id) => setFlavorIds((ids) => updateAt(ids, step - 1, id))}
              name={`flavor-${step}`}
            />
          </section>

          {step === totalSteps && (
            <section className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                Supplément
              </h3>
              <div className="mt-3 flex flex-col gap-2">
                <label className="flex cursor-pointer items-start justify-between gap-3 rounded-lg border border-border px-4 py-2.5 text-sm hover:bg-secondary/60">
                  <span className="flex items-start gap-3">
                    <Image
                      src={rechargeSupplement.image}
                      alt={rechargeSupplement.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 flex-shrink-0 rounded-md object-cover"
                    />
                    <span>
                      <span className="text-ink">
                        {rechargeSupplement.name}
                        <span className="ml-2 font-mono text-xs text-muted">
                          +{rechargeSupplement.price.toFixed(2)} €
                        </span>
                      </span>
                      <span className="mt-0.5 block text-xs text-muted">
                        {rechargeSupplement.description}
                      </span>
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={recharge}
                    onChange={(e) => setRecharge(e.target.checked)}
                    className="mt-0.5 h-4 w-4 flex-shrink-0 accent-signal"
                  />
                </label>
              </div>
            </section>
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-border p-5">
          {totalSteps > 1 && step > 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex h-11 flex-shrink-0 items-center justify-center rounded-lg border border-border px-4 text-xs font-semibold text-ink hover:bg-secondary"
            >
              Retour
            </button>
          )}

          {step === totalSteps ? (
            <div className="flex items-center gap-3 rounded-full border border-border">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Diminuer la quantité"
                className="flex h-9 w-9 items-center justify-center text-ink hover:bg-secondary"
              >
                −
              </button>
              <span className="w-4 text-center font-mono text-sm text-ink">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Augmenter la quantité"
                className="flex h-9 w-9 items-center justify-center text-ink hover:bg-secondary"
              >
                +
              </button>
            </div>
          ) : null}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="flex flex-1 items-center justify-center rounded-lg bg-signal px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-signal-hover"
            >
              Suivant
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              disabled={justAdded}
              className="flex flex-1 items-center justify-between rounded-lg bg-signal px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-signal-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span>{justAdded ? "Ajouté ✓" : "Ajouter au panier"}</span>
              <span className="font-mono">
                {(unitPrice * quantity).toFixed(2)} €
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
