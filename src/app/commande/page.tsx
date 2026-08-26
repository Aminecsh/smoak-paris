"use client";

import { useState } from "react";
import { products } from "@/lib/products";
import { chichaBases } from "@/lib/chicha";
import ProductCard from "@/components/ProductCard";
import ChichaCard from "@/components/ChichaCard";
import ChichaConfiguratorModal from "@/components/ChichaConfiguratorModal";
import CartPanel from "@/components/CartPanel";
import MobileCartButton from "@/components/MobileCartButton";

function slugify(label: string) {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-");
}

export default function CommandePage() {
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const sections = [{ label: "Chicha", id: "chicha" }, ...categories.map((c) => ({ label: c, id: slugify(c) }))];

  const [openChichaId, setOpenChichaId] = useState<string | null>(null);
  const openChicha = chichaBases.find((c) => c.id === openChichaId) ?? null;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
      <div className="py-10">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink">
          Le menu
        </h1>
        <p className="mt-1 text-sm text-muted">
          Composez votre commande, le total se met à jour en temps réel.
        </p>
      </div>

      <nav className="sticky top-20 z-20 -mx-4 flex gap-2 overflow-x-auto border-b border-border bg-background/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="flex-shrink-0 rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-ink"
          >
            {section.label}
          </a>
        ))}
      </nav>

      <div className="mt-8 grid grid-cols-1 gap-8 pb-16 lg:grid-cols-3">
        <div className="flex flex-col gap-12 lg:col-span-2">
          <section id="chicha" className="scroll-mt-36">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
              Chicha
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            <section key={category} id={slugify(category)} className="scroll-mt-36">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                {category}
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
          <div className="lg:sticky lg:top-40">
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

      <MobileCartButton />
    </main>
  );
}
