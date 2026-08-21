"use client";

import Image from "next/image";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { getQuantity, addToCart, removeFromCart } = useCart();
  const quantity = getQuantity(product.id);

  return (
    <div className="flex items-start gap-4 rounded-xl border border-brand/10 bg-cream p-4">
      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white text-2xl">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={56}
            height={56}
            className="h-full w-full object-cover"
          />
        ) : (
          product.emoji
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif font-semibold text-brand">{product.name}</h3>
          <span className="flex-shrink-0 font-mono text-sm text-brand/70">
            {product.price.toFixed(2)} €
          </span>
        </div>
        <p className="mt-1 text-sm text-brand/60">{product.description}</p>

        <div className="mt-3">
          {quantity === 0 ? (
            <button
              type="button"
              onClick={() => addToCart(product.id)}
              className="rounded-full border border-brand/20 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-brand transition-colors hover:bg-brand hover:text-white"
            >
              Ajouter
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => removeFromCart(product.id)}
                aria-label={`Retirer ${product.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand hover:bg-brand/10"
              >
                −
              </button>
              <span className="w-4 text-center font-mono text-sm text-brand">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => addToCart(product.id)}
                aria-label={`Ajouter ${product.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white hover:bg-brand-soft"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
