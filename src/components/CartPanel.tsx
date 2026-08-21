"use client";

import { products } from "@/lib/products";
import { useCart } from "@/context/CartContext";

export default function CartPanel() {
  const { items, totalPrice, setQuantity, clearCart } = useCart();

  const lines = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter((line): line is { product: (typeof products)[number]; quantity: number } => line !== null);

  return (
    <div className="rounded-xl border border-brand/10 bg-cream p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-brand">Votre panier</h2>
        {lines.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-medium text-brand/40 hover:text-brand"
          >
            Vider
          </button>
        )}
      </div>

      {lines.length === 0 ? (
        <p className="mt-4 text-sm text-brand/50">
          Votre panier est vide. Ajoutez des produits pour commencer.
        </p>
      ) : (
        <>
          <ul className="mt-4 flex flex-col gap-3">
            {lines.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-center gap-3">
                <span className="text-lg">{product.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-brand">
                    {product.name}
                  </p>
                  <p className="font-mono text-xs text-brand/50">
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
                  className="w-14 rounded-md border border-brand/20 bg-white px-2 py-1 text-center text-sm text-brand"
                />
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center justify-between border-t border-brand/10 pt-4">
            <span className="text-sm font-medium text-brand/70">Total</span>
            <span className="font-mono text-lg font-bold text-brand">
              {totalPrice.toFixed(2)} €
            </span>
          </div>

          <button
            type="button"
            disabled
            title="Disponible au Lot 2 (commande réelle)"
            className="mt-4 w-full cursor-not-allowed rounded-full bg-brand/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-brand/40"
          >
            Valider la commande — bientôt
          </button>
        </>
      )}
    </div>
  );
}
