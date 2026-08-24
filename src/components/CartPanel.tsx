"use client";

import Link from "next/link";
import { products } from "@/lib/products";
import { useCart } from "@/context/CartContext";

// Les boissons/sucreries d'une chicha sont stockées en lignes répétées (une
// entrée par unité) — on les regroupe ici pour l'affichage ("2× Coca-Cola"
// plutôt que deux lignes identiques).
function groupSupplementLines(lines: { id: string; name: string }[]) {
  const grouped = new Map<string, { name: string; quantity: number }>();
  for (const line of lines) {
    const existing = grouped.get(line.id);
    if (existing) existing.quantity += 1;
    else grouped.set(line.id, { name: line.name, quantity: 1 });
  }
  return Array.from(grouped.entries()).map(([id, value]) => ({ id, ...value }));
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
    <div className="rounded-xl border border-border bg-white p-5">
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
          <ul className="mt-4 flex flex-col gap-4">
            {configuredChichas.map((chicha) => (
              <li key={chicha.id} className="flex items-start gap-3">
                <span className="text-lg">{chicha.chichaEmoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {chicha.chichaName} — {chicha.flavorName}
                  </p>
                  <ul className="mt-0.5 text-xs text-muted">
                    {chicha.recharge && <li>+ Tête en plus</li>}
                    {chicha.extraCharcoal && <li>+ Pack de charbon</li>}
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
                  <p className="mt-1 font-mono text-xs font-semibold text-signal">
                    {chicha.unitPrice.toFixed(2)} € × {chicha.quantity}
                  </p>
                </div>
                <input
                  type="number"
                  min={0}
                  value={chicha.quantity}
                  onChange={(e) =>
                    setConfiguredChichaQuantity(
                      chicha.id,
                      Number(e.target.value),
                    )
                  }
                  aria-label={`Quantité pour ${chicha.chichaName} ${chicha.flavorName}`}
                  className="w-14 flex-shrink-0 rounded-md border border-border bg-white px-2 py-1 text-center text-sm text-ink"
                />
              </li>
            ))}

            {lines.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-center gap-3">
                <span className="text-lg">{product.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {product.name}
                  </p>
                  <p className="font-mono text-xs font-semibold text-signal">
                    {product.price.toFixed(2)} € × {quantity}
                  </p>
                </div>
                <input
                  type="number"
                  min={0}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(product.id, Number(e.target.value))
                  }
                  aria-label={`Quantité pour ${product.name}`}
                  className="w-14 rounded-md border border-border bg-white px-2 py-1 text-center text-sm text-ink"
                />
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm font-medium text-muted">Total</span>
            <span className="font-mono text-lg font-bold text-signal">
              {totalPrice.toFixed(2)} €
            </span>
          </div>

          <Link
            href="/commande/livraison"
            className="mt-4 block w-full rounded-full bg-signal px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-signal-hover"
          >
            Valider la commande
          </Link>
        </>
      )}
    </div>
  );
}
