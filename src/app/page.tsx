import Link from "next/link";
import { SERVICE_WHATSAPP_NUMBER } from "@/lib/contact";

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
      <section className="relative h-[calc(100vh-5rem)] w-full overflow-hidden">
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
        <div className="absolute inset-0 bg-black/20" />
      </section>

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

      <Link
        href="/commande"
        className="fixed bottom-6 right-6 z-30 rounded-full bg-brand px-8 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white shadow-lg transition-colors hover:bg-brand-soft sm:bottom-10 sm:right-10"
      >
        Commander
      </Link>

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
