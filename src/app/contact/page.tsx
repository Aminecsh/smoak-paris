import Link from "next/link";
import {
  SERVICE_PHONE_DISPLAY,
  SERVICE_PHONE_NUMBER,
  SERVICE_WHATSAPP_NUMBER,
} from "@/lib/contact";
import { DELIVERY_SLOTS, formatSlotLabel, LAST_RETURN_LABEL } from "@/lib/deliverySlots";

const ZONES = [
  { label: "Secteur Sud-Est", value: "Paris (5·11·12·13·14·20) · 77 · 91 · 94" },
  { label: "Secteur Nord-Ouest", value: "Reste de Paris · 78 · 92 · 93 · 95" },
];

const HORAIRES = [
  {
    label: "Créneaux de livraison",
    value: `${formatSlotLabel(DELIVERY_SLOTS[0])} — ${formatSlotLabel(
      DELIVERY_SLOTS[DELIVERY_SLOTS.length - 1],
    )}`,
  },
  { label: "Reprise du matériel", value: `Au plus tard ${LAST_RETURN_LABEL}` },
  { label: "Jours", value: "7j/7" },
];

const FAQ = [
  {
    q: "Combien de temps avant la livraison ?",
    a: "Avant 21h, vous réservez un créneau pour la soirée. À partir de 21h, les créneaux ferment et chaque commande est spontanée : livrée en ~45 minutes.",
  },
  {
    q: "Qui vient livrer et reprendre la chicha ?",
    a: "Toujours quelqu'un de l'équipe Smoak Paris — jamais un coursier externe.",
  },
  {
    q: "Que se passe-t-il si je dois écourter la session ?",
    a: "Prévenez-nous sur WhatsApp, on ajuste l'heure de reprise directement depuis votre lien de suivi.",
  },
];

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="bg-secondary">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:px-6 sm:py-28">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
            On est là
          </span>
          <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Contact
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
            Une question sur une commande, une livraison en cours ou votre
            secteur ? On répond directement, sans standard ni robot.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`https://wa.me/${SERVICE_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-signal px-8 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-signal-hover"
            >
              <svg viewBox="0 0 32 32" fill="currentColor" className="h-4 w-4">
                <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.386.703 4.605 1.912 6.47L4 29l7.72-1.874A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm.001 21.818c-1.97 0-3.86-.57-5.49-1.65l-.394-.257-4.58 1.112 1.128-4.462-.28-.42A9.77 9.77 0 0 1 5.6 15c0-5.735 4.667-10.4 10.405-10.4 5.737 0 10.4 4.665 10.4 10.4 0 5.737-4.663 10.4-10.4 10.4Zm5.68-7.79c-.31-.155-1.832-.905-2.116-1.01-.284-.104-.49-.155-.696.156-.207.31-.798 1.01-.978 1.216-.18.207-.36.233-.67.078-.31-.155-1.31-.483-2.494-1.54-.922-.822-1.545-1.838-1.726-2.148-.18-.31-.02-.478.136-.633.14-.14.31-.36.465-.54.155-.18.207-.31.31-.517.104-.207.052-.388-.026-.543-.078-.155-.696-1.676-.955-2.296-.252-.605-.508-.523-.696-.533l-.593-.01c-.207 0-.543.078-.827.388-.284.31-1.083 1.058-1.083 2.578s1.11 2.99 1.264 3.196c.155.207 2.185 3.34 5.293 4.68.74.32 1.317.512 1.766.655.742.236 1.417.203 1.95.123.595-.089 1.832-.749 2.09-1.472.259-.723.259-1.343.181-1.472-.078-.13-.284-.207-.594-.362Z" />
              </svg>
              Écrire sur WhatsApp
            </a>
            <a
              href={`tel:${SERVICE_PHONE_NUMBER}`}
              className="rounded-lg border border-border px-8 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/30"
            >
              {SERVICE_PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {HORAIRES.map((item) => (
            <div key={item.label} className="bg-white px-6 py-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
                {item.label}
              </p>
              <p className="mt-2 font-serif text-lg font-semibold text-ink">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-20 max-w-5xl px-6 pb-20 sm:px-6">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
            Où on livre
          </span>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink">
            Nos secteurs
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {ZONES.map((zone) => (
              <div
                key={zone.label}
                className="rounded-2xl bg-secondary p-6"
              >
                <h3 className="font-serif text-lg font-semibold text-ink">
                  {zone.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {zone.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:px-6">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
            Questions fréquentes
          </span>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink">
            Avant de nous écrire
          </h2>

          <div className="mt-10 divide-y divide-border border-t border-border">
            {FAQ.map((item) => (
              <div key={item.q} className="py-6">
                <h3 className="font-serif text-lg font-semibold text-ink">
                  {item.q}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-20 text-center sm:px-6">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink">
            Prêt à commander ?
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-muted">
            Composez votre chicha, on vous l&apos;apporte en personne où que
            vous soyez en Île-de-France.
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
