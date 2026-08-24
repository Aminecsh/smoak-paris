"use client";

import { useState } from "react";
import { products } from "@/lib/products";
import { chichaBases } from "@/lib/chicha";
import ProductCard from "@/components/ProductCard";
import ChichaCard from "@/components/ChichaCard";
import ChichaConfiguratorModal from "@/components/ChichaConfiguratorModal";
import CartPanel from "@/components/CartPanel";

export default function CommandePage() {
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const [openChichaId, setOpenChichaId] = useState<string | null>(null);
  const openChicha = chichaBases.find((c) => c.id === openChichaId) ?? null;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink">
        Le menu
      </h1>
      <p className="mt-1 text-sm text-muted">
        Composez votre commande, le total se met à jour en temps réel.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
              Chicha
            </h2>
            <div className="flex flex-col gap-3">
              {chichaBases.map((chicha) => (
                <ChichaCard
                  key={chicha.id}
                  chicha={chicha}
                  onSelect={setOpenChichaId}
                />
              ))}
            </div>
          </section>

          {categories.map((category) => (
            <section key={category}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                {category}
              </h2>
              <div className="flex flex-col gap-3">
                {products
                  .filter((p) => p.category === category)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </section>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <CartPanel />
          </div>
        </div>
      </div>

      {openChicha && (
        <ChichaConfiguratorModal
          chicha={openChicha}
          onClose={() => setOpenChichaId(null)}
        />
      )}
    </main>
  );
}
