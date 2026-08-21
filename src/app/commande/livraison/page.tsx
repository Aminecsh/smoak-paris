"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { products } from "@/lib/products";
import { useCart } from "@/context/CartContext";

export default function LivraisonPage() {
  const router = useRouter();
  const { items, configuredChichas, totalPrice, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEmpty = items.length === 0 && configuredChichas.length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/commandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, phone, address, note },
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          configuredChichas: configuredChichas.map((c) => ({
            chichaId: c.chichaId,
            flavorId: c.flavorId,
            recharge: c.recharge,
            extraCharcoal: c.extraCharcoal,
            extraFlavorId: c.extraFlavorId,
            drinkIds: c.drinks.map((d) => d.id),
            sweetIds: c.sweets.map((s) => s.id),
            quantity: c.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Une erreur est survenue");
      }

      clearCart();
      router.push(`/commande/confirmation/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setSubmitting(false);
    }
  };

  if (isEmpty) {
    return (
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-16 text-center sm:px-6">
        <h1 className="font-serif text-2xl font-semibold text-brand">
          Votre panier est vide
        </h1>
        <p className="mt-2 text-sm text-brand/60">
          Ajoutez des produits avant de passer commande.
        </p>
        <Link
          href="/commande"
          className="mt-6 inline-block rounded-full bg-brand px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-white hover:bg-brand-soft"
        >
          Retour au menu
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-brand">
        Livraison
      </h1>
      <p className="mt-1 text-sm text-brand/60">
        Renseignez vos coordonnées, paiement à la livraison.
      </p>

      <div className="mt-6 rounded-xl border border-brand/10 bg-cream p-4">
        <ul className="flex flex-col gap-1.5 text-sm text-brand/70">
          {configuredChichas.map((c) => (
            <li key={c.id} className="flex justify-between gap-2">
              <span className="truncate">
                {c.quantity} × {c.chichaName} — {c.flavorName}
              </span>
              <span className="flex-shrink-0 font-mono">
                {(c.unitPrice * c.quantity).toFixed(2)} €
              </span>
            </li>
          ))}
          {items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return null;
            return (
              <li key={item.productId} className="flex justify-between gap-2">
                <span className="truncate">
                  {item.quantity} × {product.name}
                </span>
                <span className="flex-shrink-0 font-mono">
                  {(product.price * item.quantity).toFixed(2)} €
                </span>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 flex items-center justify-between border-t border-brand/10 pt-3">
          <span className="text-sm font-medium text-brand/70">Total</span>
          <span className="font-mono text-lg font-bold text-brand">
            {totalPrice.toFixed(2)} €
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.08em] text-brand/50">
            Nom
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand/20 bg-white px-4 py-2.5 text-sm text-brand"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.08em] text-brand/50">
            Téléphone
          </label>
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand/20 bg-white px-4 py-2.5 text-sm text-brand"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.08em] text-brand/50">
            Adresse de livraison
          </label>
          <input
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Numéro, rue, code postal, ville"
            className="mt-1 w-full rounded-lg border border-brand/20 bg-white px-4 py-2.5 text-sm text-brand"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.08em] text-brand/50">
            Note pour le livreur (optionnel)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-lg border border-brand/20 bg-white px-4 py-2.5 text-sm text-brand"
          />
        </div>

        <div className="rounded-lg border border-brand/10 bg-cream px-4 py-3 text-sm text-brand/70">
          Paiement à la livraison.
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-full bg-brand px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-brand-soft disabled:opacity-60"
        >
          {submitting ? "Envoi..." : `Confirmer la commande — ${totalPrice.toFixed(2)} €`}
        </button>
      </form>
    </main>
  );
}
