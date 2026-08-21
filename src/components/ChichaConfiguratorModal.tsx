"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  chichaFlavors,
  rechargeSupplement,
  charcoalSupplement,
  extraFlavorSupplement,
  drinkSupplements,
  sweetSupplements,
} from "@/lib/chicha";
import { ChichaBase } from "@/lib/types";
import { useCart } from "@/context/CartContext";

export default function ChichaConfiguratorModal({
  chicha,
  onClose,
}: {
  chicha: ChichaBase;
  onClose: () => void;
}) {
  const { addConfiguredChicha } = useCart();

  const [flavorId, setFlavorId] = useState(chichaFlavors[0].id);
  const [recharge, setRecharge] = useState(false);
  const [extraCharcoal, setExtraCharcoal] = useState(false);
  const [extraFlavorEnabled, setExtraFlavorEnabled] = useState(false);
  const [extraFlavorId, setExtraFlavorId] = useState(chichaFlavors[0].id);
  const [drinkIds, setDrinkIds] = useState<Set<string>>(new Set());
  const [sweetIds, setSweetIds] = useState<Set<string>>(new Set());
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

  const toggleId = (set: Set<string>, id: string) => {
    const next = new Set(set);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    return next;
  };

  const selectedDrinks = drinkSupplements.filter((d) => drinkIds.has(d.id));
  const selectedSweets = sweetSupplements.filter((s) => sweetIds.has(s.id));

  const unitPrice =
    chicha.price +
    (recharge ? rechargeSupplement.price : 0) +
    (extraCharcoal ? charcoalSupplement.price : 0) +
    (extraFlavorEnabled ? extraFlavorSupplement.price : 0) +
    selectedDrinks.reduce((sum, d) => sum + d.price, 0) +
    selectedSweets.reduce((sum, s) => sum + s.price, 0);

  const handleAdd = () => {
    const flavor = chichaFlavors.find((f) => f.id === flavorId)!;
    const extraFlavor = extraFlavorEnabled
      ? chichaFlavors.find((f) => f.id === extraFlavorId) ?? null
      : null;

    addConfiguredChicha({
      chichaId: chicha.id,
      chichaName: chicha.name,
      chichaEmoji: chicha.emoji,
      flavorId: flavor.id,
      flavorName: flavor.name,
      recharge,
      extraCharcoal,
      extraFlavorId: extraFlavor?.id ?? null,
      extraFlavorName: extraFlavor?.name ?? null,
      drinks: selectedDrinks,
      sweets: selectedSweets,
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
        <div className="flex items-start justify-between gap-4 border-b border-brand/10 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-cream text-2xl">
              {chicha.emoji}
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-brand">
                {chicha.name}
              </h2>
              <p className="text-sm text-brand/60">{chicha.description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-brand/50 hover:bg-cream hover:text-brand"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* Goût */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-brand/50">
              Choix du goût <span className="text-brand/30">— obligatoire</span>
            </h3>
            <div className="mt-3 flex flex-col gap-2">
              {chichaFlavors.map((flavor) => (
                <label
                  key={flavor.id}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                    flavorId === flavor.id
                      ? "border-brand bg-cream"
                      : "border-brand/10 hover:bg-cream/60"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Image
                      src={flavor.image}
                      alt={flavor.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 flex-shrink-0 rounded-md object-cover"
                    />
                    <span className="text-brand">{flavor.name}</span>
                  </span>
                  <input
                    type="radio"
                    name="flavor"
                    value={flavor.id}
                    checked={flavorId === flavor.id}
                    onChange={() => setFlavorId(flavor.id)}
                    className="h-4 w-4 flex-shrink-0 accent-brand"
                  />
                </label>
              ))}
            </div>
          </section>

          {/* Supplément chicha */}
          <section className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-brand/50">
              Supplément chicha
            </h3>
            <div className="mt-3 flex flex-col gap-2">
              <label className="flex cursor-pointer items-start justify-between gap-3 rounded-lg border border-brand/10 px-4 py-2.5 text-sm hover:bg-cream/60">
                <span className="flex items-start gap-3">
                  <Image
                    src={rechargeSupplement.image}
                    alt={rechargeSupplement.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 flex-shrink-0 rounded-md object-cover"
                  />
                  <span>
                    <span className="text-brand">
                      {rechargeSupplement.name}
                      <span className="ml-2 font-mono text-xs text-brand/50">
                        +{rechargeSupplement.price.toFixed(2)} €
                      </span>
                    </span>
                    <span className="mt-0.5 block text-xs text-brand/50">
                      {rechargeSupplement.description}
                    </span>
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={recharge}
                  onChange={(e) => setRecharge(e.target.checked)}
                  className="mt-0.5 h-4 w-4 flex-shrink-0 accent-brand"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-brand/10 px-4 py-2.5 text-sm hover:bg-cream/60">
                <span className="text-brand">
                  {charcoalSupplement.name}
                  <span className="ml-2 font-mono text-xs text-brand/50">
                    +{charcoalSupplement.price.toFixed(2)} €
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={extraCharcoal}
                  onChange={(e) => setExtraCharcoal(e.target.checked)}
                  className="h-4 w-4 accent-brand"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-brand/10 px-4 py-2.5 text-sm hover:bg-cream/60">
                <span className="text-brand">
                  {extraFlavorSupplement.name}
                  <span className="ml-2 font-mono text-xs text-brand/50">
                    +{extraFlavorSupplement.price.toFixed(2)} €
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={extraFlavorEnabled}
                  onChange={(e) => setExtraFlavorEnabled(e.target.checked)}
                  className="h-4 w-4 accent-brand"
                />
              </label>
              {extraFlavorEnabled && (
                <select
                  value={extraFlavorId}
                  onChange={(e) => setExtraFlavorId(e.target.value)}
                  className="rounded-lg border border-brand/20 bg-white px-4 py-2 text-sm text-brand"
                >
                  {chichaFlavors.map((flavor) => (
                    <option key={flavor.id} value={flavor.id}>
                      {flavor.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </section>

          {/* Boisson */}
          <section className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-brand/50">
              Boisson
            </h3>
            <div className="mt-3 flex flex-col gap-2">
              {drinkSupplements.map((drink) => (
                <label
                  key={drink.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-brand/10 px-4 py-2.5 text-sm hover:bg-cream/60"
                >
                  <span className="text-brand">
                    {drink.name}
                    <span className="ml-2 font-mono text-xs text-brand/50">
                      +{drink.price.toFixed(2)} €
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={drinkIds.has(drink.id)}
                    onChange={() =>
                      setDrinkIds((prev) => toggleId(prev, drink.id))
                    }
                    className="h-4 w-4 accent-brand"
                  />
                </label>
              ))}
            </div>
          </section>

          {/* Sucreries */}
          <section className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-brand/50">
              Sucreries
            </h3>
            <div className="mt-3 flex flex-col gap-2">
              {sweetSupplements.map((sweet) => (
                <label
                  key={sweet.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-brand/10 px-4 py-2.5 text-sm hover:bg-cream/60"
                >
                  <span className="text-brand">
                    {sweet.name}
                    <span className="ml-2 font-mono text-xs text-brand/50">
                      +{sweet.price.toFixed(2)} €
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={sweetIds.has(sweet.id)}
                    onChange={() =>
                      setSweetIds((prev) => toggleId(prev, sweet.id))
                    }
                    className="h-4 w-4 accent-brand"
                  />
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="flex items-center gap-3 border-t border-brand/10 p-5">
          <div className="flex items-center gap-3 rounded-full border border-brand/20">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Diminuer la quantité"
              className="flex h-9 w-9 items-center justify-center text-brand hover:bg-cream"
            >
              −
            </button>
            <span className="w-4 text-center font-mono text-sm text-brand">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Augmenter la quantité"
              className="flex h-9 w-9 items-center justify-center text-brand hover:bg-cream"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={justAdded}
            className="flex flex-1 items-center justify-between rounded-full bg-brand px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-brand-soft disabled:opacity-70"
          >
            <span>{justAdded ? "Ajouté ✓" : "Ajouter au panier"}</span>
            <span className="font-mono">
              {(unitPrice * quantity).toFixed(2)} €
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
