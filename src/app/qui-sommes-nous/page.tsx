import Link from "next/link";

const PROCESS = [
  { n: "01", title: "Vous choisissez", desc: "Tête, goût et intensité, sur le configurateur." },
  { n: "02", title: "On prépare", desc: "Un de nous monte votre chicha avant de partir la livrer." },
  { n: "03", title: "On l'apporte", desc: "On vient en personne, où que vous soyez en Île-de-France." },
  { n: "04", title: "On repasse", desc: "On revient récupérer le matériel en fin de session." },
];

export default function QuiSommesNousPage() {
  return (
    <main className="flex flex-1 flex-col bg-background">
      {/* HERO */}
      <section className="border-b border-border bg-ink text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
          <div className="flex items-baseline gap-4 border-b border-white/15 pb-4">
            <span className="font-serif text-sm text-white/40">01</span>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
              Smoak Paris — Île-de-France
            </span>
          </div>

          <h1 className="mt-10 max-w-3xl font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            Nos chichas. Notre équipe.
            <br />
            <span className="text-white/50">Livrées par nous, en personne.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60">
            Smoak Paris achète, entretient et loue son propre parc de
            chichas. Pas de plateforme ni de sous-traitance : c&apos;est
            nous qui montons, livrons et récupérons votre chicha, en moins
            d&apos;une heure.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/commande"
              className="rounded-lg bg-signal px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-signal-hover"
            >
              Lancer une commande
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-white/30 px-8 py-3 text-sm font-semibold text-white transition-colors hover:border-white/60"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Le flux, étape par étape
            </h2>
            <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-muted sm:block">
              04 étapes · temps réel
            </span>
          </div>

          <div className="mt-8 divide-y divide-border border-t border-border">
            {PROCESS.map((step) => (
              <div
                key={step.n}
                className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-[4rem_14rem_1fr] sm:items-baseline sm:gap-8"
              >
                <span className="font-serif text-lg text-signal">
                  {step.n}
                </span>
                <h3 className="font-serif text-xl font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-16 text-center sm:px-8">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Prêt à louer votre chicha ?
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-muted">
            Composez votre chicha, on vous l&apos;apporte en personne et on
            repasse la récupérer, où que vous soyez en Île-de-France.
          </p>
          <Link
            href="/commande"
            className="rounded-lg bg-signal px-8 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-signal-hover"
          >
            Commander maintenant
          </Link>
        </div>
      </section>
    </main>
  );
}
