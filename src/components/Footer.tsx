export default function Footer() {
  return (
    <footer className="border-t border-ink bg-ink">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <span className="font-serif text-xl font-semibold text-white">
            SMOAK <span className="text-signal">PARIS</span>
          </span>
          <p className="max-w-md text-xs leading-relaxed text-white/50">
            Vente réservée aux personnes majeures. Un justificatif d&apos;âge
            pourra être demandé à la livraison.
          </p>
        </div>
        <p className="mt-8 text-xs text-white/30">
          © {new Date().getFullYear()} Smoak Paris
        </p>
      </div>
    </footer>
  );
}
