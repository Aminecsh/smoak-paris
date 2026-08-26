import { SERVICE_PHONE_DISPLAY } from "@/lib/contact";

export default function MentionsLegalesPage() {
  return (
    <main className="flex flex-1 flex-col bg-surface">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-6 sm:py-20">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
          Informations légales
        </span>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Mentions légales
        </h1>
        <p className="mt-2 text-sm text-muted">Dernière mise à jour : 26 août 2026.</p>

        <div className="mt-10 flex flex-col gap-10 text-sm leading-relaxed text-muted">
          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">1. Éditeur du site</h2>
            <p className="mt-3">
              Le site Smoak Paris est édité par{" "}
              <strong className="text-ink">
                [À COMPLÉTER — nom et forme juridique, ex : Prénom Nom,
                micro-entrepreneur]
              </strong>
              .
            </p>
            <ul className="mt-3 flex flex-col gap-1.5">
              <li>Adresse du siège : [À COMPLÉTER]</li>
              <li>SIRET : [À COMPLÉTER — en cours d&apos;immatriculation]</li>
              <li>N° de TVA intracommunautaire : [À COMPLÉTER si applicable]</li>
              <li>Téléphone : {SERVICE_PHONE_DISPLAY}</li>
              <li>Email : [À COMPLÉTER — adresse de contact professionnelle]</li>
            </ul>
            <p className="mt-3 text-xs text-muted">
              Directeur de la publication : [À COMPLÉTER — nom du responsable].
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">2. Hébergement</h2>
            <p className="mt-3">
              Le site est hébergé par Vercel Inc., 440 N Barranca Avenue #4133,
              Covina, CA 91723, États-Unis.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">
              3. Propriété intellectuelle
            </h2>
            <p className="mt-3">
              L&apos;ensemble des éléments du site (textes, logo, visuels, charte
              graphique) est la propriété de Smoak Paris, sauf mention contraire,
              et ne peut être reproduit, représenté ou exploité sans autorisation
              préalable.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">
              4. Données personnelles
            </h2>
            <p className="mt-3">
              Le traitement des données personnelles collectées sur ce site est
              décrit dans notre{" "}
              <a href="/confidentialite" className="text-ink underline">
                politique de confidentialité
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">5. Cookies</h2>
            <p className="mt-3">
              Le site utilise le stockage local du navigateur (localStorage)
              uniquement pour conserver le contenu de votre panier le temps de
              votre visite. Cette information reste sur votre appareil et n&apos;est
              transmise à aucun tiers.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">
              6. Limitation de responsabilité
            </h2>
            <p className="mt-3">
              Smoak Paris s&apos;efforce d&apos;assurer l&apos;exactitude des
              informations diffusées sur ce site, mais ne saurait être tenu
              responsable d&apos;erreurs, d&apos;omissions ou d&apos;une
              indisponibilité temporaire du service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">
              7. Droit applicable
            </h2>
            <p className="mt-3">
              Les présentes mentions légales sont soumises au droit français.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
