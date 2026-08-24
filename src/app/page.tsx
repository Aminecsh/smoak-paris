import Image from "next/image";
import Link from "next/link";
import { SERVICE_WHATSAPP_NUMBER } from "@/lib/contact";
import { products } from "@/lib/products";
import OrderTab from "@/components/OrderTab";

const PROCESS = [
  { n: "01", title: "Choisissez", desc: "Parcourez le menu et composez votre panier." },
  { n: "02", title: "Commandez", desc: "Renseignez votre adresse et validez, paiement à la livraison." },
  { n: "03", title: "Suivez", desc: "Votre livreur en temps réel sur la carte, jusqu'à votre porte." },
];

const HIGHLIGHT_IDS = [
  "canette-coca-cola",
  "red-bull",
  "bonbons-fini-fraise",
  "popcorn-caramel",
  "canette-hawaii",
  "crazy-tiger",
];

const highlights = HIGHLIGHT_IDS.map((id) => products.find((p) => p.id === id)).filter(
  (p): p is (typeof products)[number] => Boolean(p),
);

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative h-[100dvh] w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/85" />
      </section>

      <div id="hero-sentinel" aria-hidden="true" className="h-px w-full" />

      <OrderTab />

      <a
        href={`https://wa.me/${SERVICE_WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter sur WhatsApp"
        className="fixed bottom-6 left-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 sm:bottom-10 sm:left-10"
      >
        <svg viewBox="0 0 32 32" fill="currentColor" className="h-7 w-7">
          <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.386.703 4.605 1.912 6.47L4 29l7.72-1.874A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm.001 21.818c-1.97 0-3.86-.57-5.49-1.65l-.394-.257-4.58 1.112 1.128-4.462-.28-.42A9.77 9.77 0 0 1 5.6 15c0-5.735 4.667-10.4 10.405-10.4 5.737 0 10.4 4.665 10.4 10.4 0 5.737-4.663 10.4-10.4 10.4Zm5.68-7.79c-.31-.155-1.832-.905-2.116-1.01-.284-.104-.49-.155-.696.156-.207.31-.798 1.01-.978 1.216-.18.207-.36.233-.67.078-.31-.155-1.31-.483-2.494-1.54-.922-.822-1.545-1.838-1.726-2.148-.18-.31-.02-.478.136-.633.14-.14.31-.36.465-.54.155-.18.207-.31.31-.517.104-.207.052-.388-.026-.543-.078-.155-.696-1.676-.955-2.296-.252-.605-.508-.523-.696-.533l-.593-.01c-.207 0-.543.078-.827.388-.284.31-1.083 1.058-1.083 2.578s1.11 2.99 1.264 3.196c.155.207 2.185 3.34 5.293 4.68.74.32 1.317.512 1.766.655.742.236 1.417.203 1.95.123.595-.089 1.832-.749 2.09-1.472.259-.723.259-1.343.181-1.472-.078-.13-.284-.207-.594-.362Z" />
        </svg>
      </a>

      {/* PROCESS */}
      <section className="relative overflow-hidden bg-background">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #e5e3de 1px, transparent 1px), linear-gradient(to bottom, #e5e3de 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 py-20 sm:px-8 sm:py-28">
          <div className="divide-y divide-border border-t border-border">
            {PROCESS.map((step) => (
              <div
                key={step.n}
                className="grid grid-cols-1 gap-2 py-8 sm:grid-cols-[5rem_1fr_1.4fr] sm:items-baseline sm:gap-8"
              >
                <span className="font-serif text-lg text-signal">{step.n}</span>
                <h2 className="font-serif text-2xl font-semibold text-ink">
                  {step.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
                Dans le menu
              </span>
              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink">
                Ça se commande avec
              </h2>
            </div>
            <Link
              href="/commande"
              className="hidden text-xs font-semibold uppercase tracking-[0.15em] text-signal hover:text-signal-hover sm:block"
            >
              Voir tout le menu →
            </Link>
          </div>

          <div className="mt-8 -mx-6 flex snap-x gap-4 overflow-x-auto px-6 pb-2 sm:-mx-8 sm:px-8">
            {highlights.map((product) => (
              <Link
                key={product.id}
                href="/commande"
                className="group w-36 flex-shrink-0 snap-start sm:w-44"
              >
                <div className="aspect-square overflow-hidden rounded-2xl bg-white">
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="mt-3 truncate text-sm font-medium text-ink">
                  {product.name}
                </p>
                <p className="font-mono text-xs font-semibold text-signal">
                  {product.price.toFixed(2)} €
                </p>
              </Link>
            ))}
          </div>

          <Link
            href="/commande"
            className="mt-6 block text-center text-xs font-semibold uppercase tracking-[0.15em] text-signal hover:text-signal-hover sm:hidden"
          >
            Voir tout le menu →
          </Link>
        </div>
      </section>
    </main>
  );
}
