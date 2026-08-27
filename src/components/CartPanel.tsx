"use client";

import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { groupSupplementLines } from "@/lib/cartDisplay";

function Stepper({
  quantity,
  onDecrease,
  onIncrease,
  label,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  label: string;
}) {
  return (
    <div className="flex flex-shrink-0 items-center gap-1 rounded-full bg-ink px-1 py-1 text-white">
      <button
        type="button"
        onClick={onDecrease}
        aria-label={`Retirer ${label}`}
        className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-white/15"
      >
        −
      </button>
      <span className="w-4 text-center font-mono text-xs">{quantity}</span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label={`Ajouter ${label}`}
        className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-white/15"
      >
        +
      </button>
    </div>
  );
}

export default function CartPanel() {
  const {
    items,
    configuredChichas,
    totalPrice,
    setQuantity,
    setConfiguredChichaQuantity,
    clearCart,
  } = useCart();

  const lines = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter((line): line is { product: (typeof products)[number]; quantity: number } => line !== null);

  const isEmpty = lines.length === 0 && configuredChichas.length === 0;

  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-ink">Votre panier</h2>
        {!isEmpty && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-medium text-muted hover:text-ink"
          >
            Vider
          </button>
        )}
      </div>

      {isEmpty ? (
        <p className="mt-4 text-sm text-muted">
          Votre panier est vide. Ajoutez des produits pour commencer.
        </p>
      ) : (
        <>
          <ul className="mt-4 flex flex-col divide-y divide-border">
            {configuredChichas.map((chicha) => (
              <li key={chicha.id} className="flex items-start gap-3 py-3 first:pt-0">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-ink font-serif text-base font-semibold text-white">
                  {chicha.chichaName.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {chicha.chichaName} — {chicha.flavorName}
                    {chicha.secondFlavorName ? ` + ${chicha.secondFlavorName}` : ""}
                    {chicha.thirdFlavorName ? ` + ${chicha.thirdFlavorName}` : ""}
                  </p>
                  <ul className="mt-0.5 text-xs text-muted">
                    {chicha.recharge && <li>+ Tête en plus</li>}
                    {groupSupplementLines(chicha.drinks).map((drink) => (
                      <li key={drink.id}>
                        + {drink.quantity > 1 ? `${drink.quantity}× ` : ""}
                        {drink.name}
                      </li>
                    ))}
                    {groupSupplementLines(chicha.sweets).map((sweet) => (
                      <li key={sweet.id}>
                        + {sweet.quantity > 1 ? `${sweet.quantity}× ` : ""}
                        {sweet.name}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1 font-mono text-xs font-semibold text-ink">
                    {chicha.unitPrice.toFixed(2)} €
                  </p>
                </div>
                <Stepper
                  quantity={chicha.quantity}
                  label={`${chicha.chichaName} ${chicha.flavorName}`}
                  onDecrease={() =>
                    setConfiguredChichaQuantity(chicha.id, Math.max(0, chicha.quantity - 1))
                  }
                  onIncrease={() =>
                    setConfiguredChichaQuantity(chicha.id, chicha.quantity + 1)
                  }
                />
              </li>
            ))}

            {lines.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-center gap-3 py-3 first:pt-0">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary text-xl">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={44}
                      height={44}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    product.emoji
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {product.name}
                  </p>
                  <p className="font-mono text-xs font-semibold text-ink">
                    {product.price.toFixed(2)} €
                  </p>
                </div>
                <Stepper
                  quantity={quantity}
                  label={product.name}
                  onDecrease={() => setQuantity(product.id, Math.max(0, quantity - 1))}
                  onIncrease={() => setQuantity(product.id, quantity + 1)}
                />
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm font-medium text-muted">Total</span>
            <span className="font-mono text-lg font-bold text-ink">
              {totalPrice.toFixed(2)} €
            </span>
          </div>

          <Link
            href="/commande/livraison"
            className="mt-4 block w-full rounded-lg bg-ink px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-signal-hover"
          >
            Valider la commande
          </Link>
        </>
      )}
    </div>
  );
}
