import Image from "next/image";
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
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-14 sm:px-6 sm:pb-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src="/logo.png"
              alt="Smoak Paris"
              width={936}
              height={491}
              className="h-14 w-auto brightness-0 invert"
            />
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
              <li>Créneaux jusqu&apos;à 21h, spontané ensuite (~45 min)</li>
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

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p>© {new Date().getFullYear()} Smoak Paris</p>
            <Link href="/mentions-legales" className="hover:text-white/60">
              Mentions légales
            </Link>
            <Link href="/cgv" className="hover:text-white/60">
              CGV
            </Link>
            <Link href="/confidentialite" className="hover:text-white/60">
              Confidentialité
            </Link>
          </div>
          <p className="max-w-md sm:text-right">
            Vente réservée aux personnes majeures. Un justificatif d&apos;âge
            pourra être demandé à la livraison.
          </p>
        </div>
      </div>
    </footer>
  );
}
