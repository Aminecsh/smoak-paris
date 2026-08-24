import Link from "next/link";
import { SERVICE_PHONE_DISPLAY, SERVICE_PHONE_NUMBER, SERVICE_WHATSAPP_NUMBER } from "@/lib/contact";
import { DELIVERY_SLOTS, formatSlotLabel } from "@/lib/deliverySlots";

const NAV_LINKS = [
  { href: "/qui-sommes-nous", label: "Qui sommes-nous" },
  { href: "/commande", label: "Commander" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="font-serif text-xl font-semibold text-white">
              SMOAK <span className="text-white/50">PARIS</span>
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/40">
              Chicha premium livrée chez vous, achetée et entretenue par
              notre équipe, en Île-de-France.
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
              Navigation
            </span>
            <nav className="mt-4 flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
              Livraison
            </span>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-white/60">
              <li>Paris et Île-de-France</li>
              <li>
                {formatSlotLabel(DELIVERY_SLOTS[0])} —{" "}
                {formatSlotLabel(DELIVERY_SLOTS[DELIVERY_SLOTS.length - 1])}, 7j/7
              </li>
              <li>45 min en moyenne</li>
            </ul>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
              Contact
            </span>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              <li>
                <a
                  href={`https://wa.me/${SERVICE_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`tel:${SERVICE_PHONE_NUMBER}`}
                  className="text-white/60 transition-colors hover:text-white"
                >
                  {SERVICE_PHONE_DISPLAY}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Smoak Paris</p>
          <p className="max-w-md sm:text-right">
            Vente réservée aux personnes majeures. Un justificatif d&apos;âge
            pourra être demandé à la livraison.
          </p>
        </div>
      </div>
    </footer>
  );
}
