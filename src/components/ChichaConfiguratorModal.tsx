"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  chichaFlavors,
  rechargeSupplement,
  drinkSupplements,
  sweetSupplements,
  drinkSurcharge,
  sweetSurcharge,
} from "@/lib/chicha";
import { ChichaBase, ChichaFlavor, ChichaSupplement } from "@/lib/types";
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

function SupplementList({
  items,
  selectedId,
  onSelect,
  name,
  surchargeFor,
}: {
  items: ChichaSupplement[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  name: string;
  surchargeFor: (item: ChichaSupplement) => number;
}) {
  return (
    <div className="mt-3 flex flex-col gap-2">
      {items.map((item) => {
        const extra = surchargeFor(item);
        return (
        <label
          key={item.id}
          className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
            selectedId === item.id
              ? "border-signal bg-secondary"
              : "border-border hover:bg-secondary/60"
          }`}
        >
          <span className="flex min-w-0 items-center gap-3">
            {item.image && (
              <Image
                src={item.image}
                alt={item.name}
                width={40}
                height={40}
                className="h-10 w-10 flex-shrink-0 rounded-md object-cover"
              />
            )}
            <span className="truncate text-ink">
              {item.name}
              {extra > 0 && (
                <span className="ml-2 font-mono text-xs text-muted">
                  +{extra.toFixed(2)} €
                </span>
              )}
            </span>
          </span>
          <input
            type="radio"
            name={name}
            value={item.id}
            checked={selectedId === item.id}
            onChange={() => onSelect(item.id)}
            className="h-4 w-4 flex-shrink-0 accent-signal"
          />
        </label>
        );
      })}
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
  const isPack = Boolean(chicha.isPack);
  const isDuo = Boolean(chicha.isDuo);
  const isSoiree = Boolean(chicha.isSoiree);
  const totalSteps = isPack ? 3 : isDuo ? 2 : isSoiree ? 3 : 1;
  const stepLabels = isPack
    ? ["Goût", "Boisson", "Bonbon"]
    : isDuo
      ? ["Goût 1", "Goût 2"]
      : isSoiree
        ? ["Chicha 1", "Chicha 2", "Chicha 3"]
        : [];

  const [step, setStep] = useState(1);
  const [flavorId, setFlavorId] = useState(chichaFlavors[0].id);
  const [secondFlavorId, setSecondFlavorId] = useState(chichaFlavors[0].id);
  const [recharge, setRecharge] = useState(false);
  const [packDrinkId, setPackDrinkId] = useState<string | null>(null);
  const [packSweetId, setPackSweetId] = useState<string | null>(null);
  const [soireeFlavorIds, setSoireeFlavorIds] = useState<string[]>([
    chichaFlavors[0].id,
    chichaFlavors[0].id,
    chichaFlavors[0].id,
  ]);
  const [soireeDrinkIds, setSoireeDrinkIds] = useState<(string | null)[]>([null, null, null]);
  const [soireeSweetIds, setSoireeSweetIds] = useState<(string | null)[]>([null, null, null]);
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
    isPack && packDrink
      ? [{ id: packDrink.id, name: packDrink.name, price: drinkSurcharge(packDrink) }]
      : [];
  const selectedSweets =
    isPack && packSweet
      ? [{ id: packSweet.id, name: packSweet.name, price: sweetSurcharge(packSweet) }]
      : [];

  const soireeDrinkSurchargeTotal = isSoiree
    ? soireeDrinkIds.reduce((sum, id) => {
        const drink = drinkSupplements.find((d) => d.id === id);
        return sum + (drink ? drinkSurcharge(drink) : 0);
      }, 0)
    : 0;
  const soireeSweetSurchargeTotal = isSoiree
    ? soireeSweetIds.reduce((sum, id) => {
        const sweet = sweetSupplements.find((s) => s.id === id);
        return sum + (sweet ? sweetSurcharge(sweet) : 0);
      }, 0)
    : 0;

  const unitPrice =
    chicha.price +
    (recharge ? rechargeSupplement.price : 0) +
    (isPack && packDrink ? drinkSurcharge(packDrink) : 0) +
    (isPack && packSweet ? sweetSurcharge(packSweet) : 0) +
    soireeDrinkSurchargeTotal +
    soireeSweetSurchargeTotal;

  const handleAdd = () => {
    if (isSoiree) {
      const flavors = soireeFlavorIds.map((id) => chichaFlavors.find((f) => f.id === id)!);
      const drinks = soireeDrinkIds.map((id) => {
        const drink = drinkSupplements.find((d) => d.id === id)!;
        return { id: drink.id, name: drink.name, price: drinkSurcharge(drink) };
      });
      const sweets = soireeSweetIds.map((id) => {
        const sweet = sweetSupplements.find((s) => s.id === id)!;
        return { id: sweet.id, name: sweet.name, price: sweetSurcharge(sweet) };
      });

      addConfiguredChicha({
        chichaId: chicha.id,
        chichaName: chicha.name,
        chichaEmoji: chicha.emoji,
        flavorId: flavors[0].id,
        flavorName: flavors[0].name,
        secondFlavorId: flavors[1].id,
        secondFlavorName: flavors[1].name,
        thirdFlavorId: flavors[2].id,
        thirdFlavorName: flavors[2].name,
        recharge: false,
        drinks,
        sweets,
        unitPrice,
        quantity,
      });
    } else {
      const flavor = chichaFlavors.find((f) => f.id === flavorId)!;
      const secondFlavor = isDuo
        ? chichaFlavors.find((f) => f.id === secondFlavorId)!
        : null;

      addConfiguredChicha({
        chichaId: chicha.id,
        chichaName: chicha.name,
        chichaEmoji: chicha.emoji,
        flavorId: flavor.id,
        flavorName: flavor.name,
        secondFlavorId: secondFlavor?.id,
        secondFlavorName: secondFlavor?.name,
        recharge,
        drinks: selectedDrinks,
        sweets: selectedSweets,
        unitPrice,
        quantity,
      });
    }

    setJustAdded(true);
    setTimeout(onClose, 500);
  };

  const canGoNext =
    isPack && step === 2
      ? Boolean(packDrinkId)
      : isPack && step === 3
        ? Boolean(packSweetId)
        : isSoiree
          ? Boolean(soireeDrinkIds[step - 1]) && Boolean(soireeSweetIds[step - 1])
          : true;

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
          {isDuo && step === 1 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                Goût de la première chicha
              </h3>
              <FlavorGrid selectedId={flavorId} onSelect={setFlavorId} name="flavor-1" />
            </section>
          )}

          {isDuo && step === 2 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                Goût de la seconde chicha
              </h3>
              <FlavorGrid
                selectedId={secondFlavorId}
                onSelect={setSecondFlavorId}
                name="flavor-2"
              />
            </section>
          )}

          {!isDuo && !isSoiree && (!isPack || step === 1) && (
            <>
              {/* Goût */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                  Choix du goût <span className="text-muted">— obligatoire</span>
                </h3>
                <FlavorGrid selectedId={flavorId} onSelect={setFlavorId} name="flavor" />
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
                </div>
              </section>
            </>
          )}

          {isPack && step === 2 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                Boisson <span className="text-muted">— incluse, au choix</span>
              </h3>
              <SupplementList
                items={drinkSupplements}
                selectedId={packDrinkId}
                onSelect={setPackDrinkId}
                name="pack-drink"
                surchargeFor={drinkSurcharge}
              />
            </section>
          )}

          {isPack && step === 3 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                Sucreries <span className="text-muted">— incluse, au choix</span>
              </h3>
              <SupplementList
                items={sweetSupplements}
                selectedId={packSweetId}
                onSelect={setPackSweetId}
                name="pack-sweet"
                surchargeFor={sweetSurcharge}
              />
            </section>
          )}

          {isSoiree && step >= 1 && step <= 3 && (
            <>
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                  Chicha {step} — Goût
                </h3>
                <FlavorGrid
                  selectedId={soireeFlavorIds[step - 1]}
                  onSelect={(id) => setSoireeFlavorIds((ids) => updateAt(ids, step - 1, id))}
                  name={`soiree-flavor-${step}`}
                />
              </section>

              <section className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                  Chicha {step} — Boisson <span className="text-muted">— incluse, au choix</span>
                </h3>
                <SupplementList
                  items={drinkSupplements}
                  selectedId={soireeDrinkIds[step - 1]}
                  onSelect={(id) => setSoireeDrinkIds((ids) => updateAt(ids, step - 1, id))}
                  name={`soiree-drink-${step}`}
                  surchargeFor={drinkSurcharge}
                />
              </section>

              <section className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                  Chicha {step} — Bonbon <span className="text-muted">— inclus, au choix</span>
                </h3>
                <SupplementList
                  items={sweetSupplements}
                  selectedId={soireeSweetIds[step - 1]}
                  onSelect={(id) => setSoireeSweetIds((ids) => updateAt(ids, step - 1, id))}
                  name={`soiree-sweet-${step}`}
                  surchargeFor={sweetSurcharge}
                />
              </section>
            </>
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
              disabled={!canGoNext}
              className="flex flex-1 items-center justify-center rounded-lg bg-signal px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-signal-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Suivant
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              disabled={justAdded || !canGoNext}
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
