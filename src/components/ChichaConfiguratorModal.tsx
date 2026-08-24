"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  chichaFlavors,
  rechargeSupplement,
  charcoalSupplement,
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
  const isPack = Boolean(chicha.isPack);

  const [flavorId, setFlavorId] = useState(chichaFlavors[0].id);
  const [recharge, setRecharge] = useState(false);
  const [extraCharcoal, setExtraCharcoal] = useState(false);
  const [packDrinkId, setPackDrinkId] = useState(drinkSupplements[0]?.id ?? "");
  const [packSweetId, setPackSweetId] = useState(sweetSupplements[0]?.id ?? "");
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

  const packDrink = drinkSupplements.find((d) => d.id === packDrinkId);
  const packSweet = sweetSupplements.find((s) => s.id === packSweetId);

  const selectedDrinks =
    isPack && packDrink ? [{ id: packDrink.id, name: packDrink.name, price: 0 }] : [];
  const selectedSweets =
    isPack && packSweet ? [{ id: packSweet.id, name: packSweet.name, price: 0 }] : [];

  const unitPrice =
    chicha.price +
    (recharge ? rechargeSupplement.price : 0) +
    (extraCharcoal ? charcoalSupplement.price : 0);

  const handleAdd = () => {
    const flavor = chichaFlavors.find((f) => f.id === flavorId)!;

    addConfiguredChicha({
      chichaId: chicha.id,
      chichaName: chicha.name,
      chichaEmoji: chicha.emoji,
      flavorId: flavor.id,
      flavorName: flavor.name,
      recharge,
      extraCharcoal,
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

        <div className="flex-1 overflow-y-auto p-5">
          {/* Goût */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
              Choix du goût <span className="text-muted">— obligatoire</span>
            </h3>
            <div className="mt-3 flex flex-col gap-2">
              {chichaFlavors.map((flavor) => (
                <label
                  key={flavor.id}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                    flavorId === flavor.id
                      ? "border-signal bg-secondary"
                      : "border-border hover:bg-secondary/60"
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
                    <span className="text-ink">{flavor.name}</span>
                  </span>
                  <input
                    type="radio"
                    name="flavor"
                    value={flavor.id}
                    checked={flavorId === flavor.id}
                    onChange={() => setFlavorId(flavor.id)}
                    className="h-4 w-4 flex-shrink-0 accent-signal"
                  />
                </label>
              ))}
            </div>
          </section>

          {/* Supplément chicha */}
          <section className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
              Supplément chicha
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

              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm hover:bg-secondary/60">
                <span className="text-ink">
                  {charcoalSupplement.name}
                  <span className="ml-2 font-mono text-xs text-muted">
                    +{charcoalSupplement.price.toFixed(2)} €
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={extraCharcoal}
                  onChange={(e) => setExtraCharcoal(e.target.checked)}
                  className="h-4 w-4 accent-signal"
                />
              </label>
            </div>
          </section>

          {isPack && (
            <>
              {/* Boisson */}
              <section className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                  Boisson <span className="text-muted">— incluse, au choix</span>
                </h3>
                <div className="mt-3 flex flex-col gap-2">
                  {drinkSupplements.map((drink) => (
                    <label
                      key={drink.id}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                        packDrinkId === drink.id
                          ? "border-signal bg-secondary"
                          : "border-border hover:bg-secondary/60"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        {drink.image && (
                          <Image
                            src={drink.image}
                            alt={drink.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 flex-shrink-0 rounded-md object-cover"
                          />
                        )}
                        <span className="truncate text-ink">{drink.name}</span>
                      </span>
                      <input
                        type="radio"
                        name="pack-drink"
                        value={drink.id}
                        checked={packDrinkId === drink.id}
                        onChange={() => setPackDrinkId(drink.id)}
                        className="h-4 w-4 flex-shrink-0 accent-signal"
                      />
                    </label>
                  ))}
                </div>
              </section>

              {/* Sucreries */}
              <section className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                  Sucreries <span className="text-muted">— incluse, au choix</span>
                </h3>
                <div className="mt-3 flex flex-col gap-2">
                  {sweetSupplements.map((sweet) => (
                    <label
                      key={sweet.id}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                        packSweetId === sweet.id
                          ? "border-signal bg-secondary"
                          : "border-border hover:bg-secondary/60"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        {sweet.image && (
                          <Image
                            src={sweet.image}
                            alt={sweet.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 flex-shrink-0 rounded-md object-cover"
                          />
                        )}
                        <span className="truncate text-ink">{sweet.name}</span>
                      </span>
                      <input
                        type="radio"
                        name="pack-sweet"
                        value={sweet.id}
                        checked={packSweetId === sweet.id}
                        onChange={() => setPackSweetId(sweet.id)}
                        className="h-4 w-4 flex-shrink-0 accent-signal"
                      />
                    </label>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-border p-5">
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

          <button
            type="button"
            onClick={handleAdd}
            disabled={justAdded}
            className="flex flex-1 items-center justify-between rounded-lg bg-signal px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-signal-hover disabled:opacity-70"
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
