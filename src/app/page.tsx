import Link from "next/link";
import MarqueeBanner from "@/components/MarqueeBanner";

const steps = [
  {
    emoji: "📋",
    title: "Choisissez",
    desc: "Parcourez le menu et composez votre panier.",
  },
  {
    emoji: "✅",
    title: "Commandez",
    desc: "Renseignez votre adresse et validez.",
  },
  {
    emoji: "📍",
    title: "Suivez",
    desc: "Suivez votre livreur en temps réel sur la carte.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand/50">
          Paris · Livraison à domicile
        </span>
        <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-brand sm:text-6xl">
          La chicha, livrée
          <br />
          chez vous.
        </h1>
        <p className="mt-5 max-w-md text-base text-brand/60">
          Narguilés premium, saveurs authentiques et charbon naturel,
          préparés à Paris, livrés jusqu&apos;à votre porte.
        </p>
        <Link
          href="/commande"
          className="mt-8 rounded-full bg-brand px-8 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-brand-soft"
        >
          Commander
        </Link>
      </section>

      <MarqueeBanner text="Livraison à domicile" />

      <section className="bg-cream">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.title} className="flex flex-col items-center text-center">
              <span className="text-3xl">{step.emoji}</span>
              <h2 className="mt-3 font-serif text-lg font-semibold text-brand">
                {step.title}
              </h2>
              <p className="mt-1 text-sm text-brand/60">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
