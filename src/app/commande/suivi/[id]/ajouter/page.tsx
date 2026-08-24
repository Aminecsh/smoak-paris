"use client";

import { use, useState } from "react";
import Link from "next/link";
import { products } from "@/lib/products";

export default function AjouterArticlesPage({
  params,
}: PageProps<"/commande/suivi/[id]/ajouter">) {
  const { id } = use(params);
  const categories = Array.from(new Set(products.map((p) => p.category)));

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ addedTotal: number; newTotal: number } | null>(
    null,
  );

  const addOne = (productId: string) =>
    setQuantities((q) => ({ ...q, [productId]: (q[productId] ?? 0) + 1 }));
  const removeOne = (productId: string) =>
    setQuantities((q) => ({ ...q, [productId]: Math.max(0, (q[productId] ?? 0) - 1) }));

  const items = Object.entries(quantities)
    .filter(([, qty]) => qty > 0)
    .map(([productId, quantity]) => ({ productId, quantity }));

  const addedTotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/commandes/${id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Une erreur est survenue");
      }
      setResult({ addedTotal: data.addedTotal, newTotal: data.newTotal });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-16 text-center sm:px-6">
        <span className="text-3xl">✅</span>
        <h1 className="mt-2 font-serif text-2xl font-semibold text-ink">
          Articles ajoutés
        </h1>
        <p className="mt-2 text-sm text-muted">
          + {result.addedTotal.toFixed(2)} € — nouveau total :{" "}
          {result.newTotal.toFixed(2)} €
        </p>
        <Link
          href={`/commande/suivi/${id}`}
          className="mt-6 inline-block rounded-lg bg-signal px-5 py-2.5 text-xs font-semibold text-white hover:bg-signal-hover"
        >
          Retour au suivi
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink">
        Ajouter à ma commande
      </h1>
      <p className="mt-1 text-sm text-muted">
        Le supplément sera réglé à la livraison, avec le reste de la commande.
      </p>

      <div className="mt-8 flex flex-col gap-8">
        {categories.map((category) => (
          <section key={category}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
              {category}
            </h2>
            <div className="flex flex-col gap-3">
              {products
                .filter((p) => p.category === category)
                .map((product) => {
                  const quantity = quantities[product.id] ?? 0;
                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-4 rounded-xl border border-border bg-white p-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-serif font-semibold text-ink">
                            {product.name}
                          </h3>
                          <span className="flex-shrink-0 font-mono text-sm font-semibold text-signal">
                            {product.price.toFixed(2)} €
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted">
                          {product.description}
                        </p>
                      </div>

                      {quantity === 0 ? (
                        <button
                          type="button"
                          onClick={() => addOne(product.id)}
                          className="flex-shrink-0 rounded-lg border border-border bg-white px-4 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-signal hover:text-white"
                        >
                          Ajouter
                        </button>
                      ) : (
                        <div className="flex flex-shrink-0 items-center gap-3">
                          <button
                            type="button"
                            onClick={() => removeOne(product.id)}
                            aria-label={`Retirer ${product.name}`}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink hover:bg-signal/10"
                          >
                            −
                          </button>
                          <span className="w-4 text-center font-mono text-sm text-ink">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => addOne(product.id)}
                            aria-label={`Ajouter ${product.name}`}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-signal text-white hover:bg-signal-hover"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </section>
        ))}
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={items.length === 0 || submitting}
        className="mt-6 w-full rounded-lg bg-signal px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-signal-hover disabled:opacity-60"
      >
        {submitting
          ? "Envoi..."
          : `Ajouter à ma commande — + ${addedTotal.toFixed(2)} €`}
      </button>

      <Link
        href={`/commande/suivi/${id}`}
        className="mt-3 block text-center text-xs font-medium text-muted hover:text-ink"
      >
        Annuler
      </Link>
    </main>
  );
}
