"use client";

import Image from "next/image";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { getQuantity, addToCart, removeFromCart } = useCart();
  const quantity = getQuantity(product.id);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-4xl">
            {product.emoji}
          </span>
        )}

        <div className="absolute bottom-2 right-2">
          {quantity === 0 ? (
            <button
              type="button"
              onClick={() => addToCart(product.id)}
              aria-label={`Ajouter ${product.name}`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-lg font-semibold text-white shadow-md transition-transform hover:scale-105"
            >
              +
            </button>
          ) : (
            <div className="flex items-center gap-1 rounded-full bg-ink px-1.5 py-1 text-white shadow-md">
              <button
                type="button"
                onClick={() => removeFromCart(product.id)}
                aria-label={`Retirer ${product.name}`}
                className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white/15"
              >
                −
              </button>
              <span className="w-4 text-center font-mono text-sm">{quantity}</span>
              <button
                type="button"
                onClick={() => addToCart(product.id)}
                aria-label={`Ajouter ${product.name}`}
                className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white/15"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif font-semibold text-ink">{product.name}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted">
          {product.description}
        </p>
        <p className="mt-2 font-mono text-sm font-semibold text-ink">
          {product.price.toFixed(2)} €
        </p>
      </div>
    </div>
  );
}
