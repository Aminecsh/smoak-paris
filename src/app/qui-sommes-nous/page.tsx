import Link from "next/link";

const KPIS = [
  { value: "38", unit: "min", label: "Délai moyen, livré par nous" },
  { value: "60+", unit: "", label: "Chichas dans notre flotte" },
  { value: "4.9", unit: "/5", label: "Note client" },
  { value: "0", unit: "", label: "Intermédiaire" },
  { value: "15+", unit: "", label: "Saveurs en stock" },
  { value: "100", unit: "%", label: "Matériel nettoyé par nos soins" },
];

const PROCESS = [
  { n: "01", title: "Vous choisissez", desc: "Tête, tabac et intensité, sur le configurateur." },
  { n: "02", title: "On prépare", desc: "Un de nous monte votre chicha avant de partir la livrer." },
  { n: "03", title: "On l'apporte", desc: "On vient en personne, où que vous soyez en Île-de-France." },
  { n: "04", title: "On repasse", desc: "On revient récupérer le matériel en fin de session." },
];

const STACK = [
  { label: "Zone de couverture", value: "Paris + Île-de-France" },
  { label: "Créneaux", value: "Midi · Soir · Nuit" },
  { label: "Paiement", value: "CB · Espèces · Lien sécurisé" },
  { label: "Livreur", value: "Toujours un de l'équipe Smoak Paris" },
];

export default function QuiSommesNousPage() {
  return (
    <main className="flex flex-1 flex-col bg-brand text-cream">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-cream/10">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #f6efe4 1px, transparent 1px), linear-gradient(to bottom, #f6efe4 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="pointer-events-none absolute -top-40 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-cream/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-[-10%] h-[24rem] w-[24rem] rounded-full bg-cream/5 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:px-8 sm:py-32">
          <div className="flex items-baseline gap-4 border-b border-cream/15 pb-4">
            <span className="font-serif text-sm text-cream/40">01</span>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-cream/40">
              Smoak Paris — Île-de-France
            </span>
          </div>

          <h1 className="mt-10 max-w-3xl font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-cream sm:text-6xl">
            Nos chichas. Notre équipe.
            <br />
            <span className="text-cream/50">Livrées par nous, en personne.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/60">
            Smoak Paris achète, entretient et loue son propre parc de
            chichas. Pas de plateforme ni de sous-traitance : c&apos;est
            nous qui montons, livrons et récupérons votre chicha, en moins
            d&apos;une heure.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/commande"
              className="rounded-full bg-cream px-8 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-brand shadow-[0_0_30px_-5px_rgba(246,239,228,0.5)] transition-transform hover:scale-[1.03]"
            >
              Lancer une commande
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-cream/30 px-8 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-cream transition-colors hover:border-cream/60"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      {/* KPI STRIP */}
      <section className="border-b border-cream/10">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
            {KPIS.map((kpi) => (
              <div key={kpi.label} className="border-l border-cream/15 pl-5">
                <p className="font-serif text-3xl font-semibold tabular-nums text-cream sm:text-4xl">
                  {kpi.value}
                  <span className="text-base text-cream/40">{kpi.unit}</span>
                </p>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-cream/50">
                  {kpi.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-b border-cream/10">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-cream sm:text-4xl">
              Le flux, étape par étape
            </h2>
            <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-cream/40 sm:block">
              04 étapes · temps réel
            </span>
          </div>

          <div className="mt-10 divide-y divide-cream/10 border-t border-cream/10">
            {PROCESS.map((step) => (
              <div
                key={step.n}
                className="grid grid-cols-1 gap-2 py-7 sm:grid-cols-[4rem_14rem_1fr] sm:items-baseline sm:gap-8"
              >
                <span className="font-serif text-lg text-cream/35">
                  {step.n}
                </span>
                <h3 className="font-serif text-xl font-semibold text-cream">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-cream/50">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECS */}
      <section className="border-b border-cream/10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-cream/40">
              Notre flotte
            </span>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-cream sm:text-4xl">
              Notre matériel, notre équipe
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/50">
              Chaque chicha nous appartient : on l&apos;achète, on l&apos;entretient
              et on la loue nous-mêmes. Pas de coursier externe — celui qui
              vous livre est celui qui reviendra la récupérer.
            </p>
          </div>

          <div className="divide-y divide-cream/10 border-t border-cream/10">
            {STACK.map((item) => (
              <div
                key={item.label}
                className="flex items-baseline justify-between gap-6 py-5"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-cream/40">
                  {item.label}
                </p>
                <p className="font-serif text-lg font-semibold text-cream">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #f6efe4 1px, transparent 1px), linear-gradient(to bottom, #f6efe4 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center sm:px-8">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-cream sm:text-4xl">
            Prêt à louer votre chicha ?
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-cream/60">
            Composez votre chicha, on vous l&apos;apporte en personne et on
            repasse la récupérer, où que vous soyez en Île-de-France.
          </p>
          <Link
            href="/commande"
            className="rounded-full bg-cream px-8 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-brand shadow-[0_0_30px_-5px_rgba(246,239,228,0.5)] transition-transform hover:scale-[1.03]"
          >
            Commander maintenant
          </Link>
        </div>
      </section>
    </main>
  );
}
