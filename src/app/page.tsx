import Image from "next/image";
import Link from "next/link";
import { SERVICE_WHATSAPP_NUMBER } from "@/lib/contact";
import { products } from "@/lib/products";
import { chichaBases } from "@/lib/chicha";
import OrderTab from "@/components/OrderTab";

const STATS: { value: string; label: string; withStar?: boolean; live?: boolean }[] = [
  { value: "45 min", label: "Livraison immédiate" },
  { value: "50 chichas", label: "Dans notre flotte" },
  { value: "4.8/5", label: "Avis Trustpilot", withStar: true },
  { value: "180+", label: "Commandes livrées", live: true },
];

const REVIEWS = [
  { name: "Mehdi", place: "Paris 11e", quote: "Livré en 25 minutes un vendredi soir, franchement au top." },
  { name: "Sarah", place: "Vincennes", quote: "Simple, rapide, et la chicha nickel montée dès l'arrivée." },
  { name: "Yanis", place: "Paris 18e", quote: "Service pro, aucun jugement, le mec est resté hyper discret." },
  { name: "Camille", place: "Montreuil", quote: "Ils récupèrent le matériel le soir même, ils ont été arrangeants pour le reprendre plus tôt car on partait en boîte. Top service." },
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

      {/* STATS */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-16">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-x-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center sm:items-start sm:text-left">
                <p className="flex items-center gap-2 font-serif text-2xl font-semibold text-ink sm:text-3xl">
                  {stat.live && (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                  )}
                  {stat.withStar && (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-signal">
                      <path d="M10 1.5l2.6 5.4 5.9.7-4.3 4.1 1.1 5.9L10 14.7l-5.3 2.9 1.1-5.9-4.3-4.1 5.9-.7L10 1.5z" />
                    </svg>
                  )}
                  {stat.value}
                </p>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.15em] text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AVIS CLIENTS */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
          <span className="block text-center text-xs font-semibold uppercase tracking-[0.3em] text-muted sm:text-left">
            Ce qu&apos;ils en disent
          </span>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {REVIEWS.map((review) => (
              <div
                key={review.name}
                className="rounded-2xl border border-border bg-white p-6"
              >
                <p className="text-sm leading-relaxed text-ink">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <p className="mt-4 text-xs font-semibold text-ink">
                  {review.name}
                  <span className="ml-1.5 font-normal text-muted">— {review.place}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MENU */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
                Dans le menu
              </span>
              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink">
                Le menu
              </h2>
            </div>
            <Link
              href="/commande"
              className="hidden text-xs font-semibold uppercase tracking-[0.15em] text-signal hover:text-signal-hover sm:block"
            >
              Voir tout le menu →
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {chichaBases.map((chicha) => (
              <Link
                key={chicha.id}
                href={`/commande?open=${chicha.id}`}
                className="group relative flex aspect-square w-full flex-col overflow-hidden rounded-2xl"
              >
                {chicha.image && (
                  <Image
                    src={chicha.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />
                <div className="relative mt-auto flex flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-serif text-xl font-semibold text-white">
                      {chicha.name}
                    </h3>
                    <span className="font-mono text-sm font-semibold text-white">
                      dès {chicha.price.toFixed(2)} €
                    </span>
                  </div>
                  <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-ink transition-colors group-hover:bg-white/90">
                    Composer
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
              Boissons &amp; douceurs
            </span>
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {highlights.slice(0, 6).map((product) => (
                <Link key={product.id} href="/commande" className="group">
                  <div className="aspect-square overflow-hidden rounded-xl bg-white">
                    {product.image && (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={160}
                        height={160}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <p className="mt-2 truncate text-xs font-medium text-ink">
                    {product.name}
                  </p>
                  <p className="font-mono text-[11px] font-semibold text-signal">
                    {product.price.toFixed(2)} €
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/commande"
            className="mt-8 block text-center text-xs font-semibold uppercase tracking-[0.15em] text-signal hover:text-signal-hover sm:hidden"
          >
            Voir tout le menu →
          </Link>
        </div>
      </section>
    </main>
  );
}
