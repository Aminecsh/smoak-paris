export default function ConfidentialitePage() {
  return (
    <main className="flex flex-1 flex-col bg-surface">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-6 sm:py-20">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
          RGPD
        </span>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Politique de confidentialité
        </h1>
        <p className="mt-2 text-sm text-muted">Dernière mise à jour : 26 août 2026.</p>

        <div className="mt-10 flex flex-col gap-10 text-sm leading-relaxed text-muted">
          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">
              1. Responsable du traitement
            </h2>
            <p className="mt-3">
              Le responsable du traitement des données collectées sur ce site
              est <strong className="text-ink">Smoak Paris</strong>, joignable
              à l&apos;adresse smoak.paris@gmail.com.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">
              2. Données collectées
            </h2>
            <p className="mt-3">Lorsque vous passez commande, nous collectons :</p>
            <ul className="mt-3 flex flex-col gap-1.5">
              <li>Votre nom et prénom</li>
              <li>Votre numéro de téléphone</li>
              <li>Votre adresse email</li>
              <li>
                Votre adresse de livraison et les coordonnées géographiques
                associées (pour le calcul du secteur et le suivi en temps réel)
              </li>
              <li>Le détail et l&apos;historique de vos commandes</li>
            </ul>
            <p className="mt-3">
              La position d&apos;un livreur peut également être enregistrée
              temporairement pendant une livraison en cours, afin de vous
              permettre de suivre l&apos;acheminement de votre commande.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">
              3. Finalités du traitement
            </h2>
            <p className="mt-3">Ces données sont utilisées pour :</p>
            <ul className="mt-3 flex flex-col gap-1.5">
              <li>Traiter et livrer votre commande</li>
              <li>Vous transmettre un lien de suivi de commande</li>
              <li>Vous contacter en cas de besoin concernant votre commande</li>
              <li>Assurer le service après-vente et traiter les réclamations</li>
            </ul>
            <p className="mt-3">
              La base légale de ces traitements est l&apos;exécution du contrat
              de vente conclu avec vous.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">
              4. Destinataires des données
            </h2>
            <p className="mt-3">
              Vos données sont accessibles à l&apos;équipe Smoak Paris
              (préparation et livraison des commandes) et à nos prestataires
              techniques, dans la stricte mesure nécessaire au fonctionnement
              du service : hébergement du site (Vercel), base de données
              (Supabase), et le cas échéant l&apos;envoi du lien de suivi par
              SMS/WhatsApp ou par email. Ces prestataires n&apos;utilisent vos
              données à aucune autre fin.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">
              5. Durée de conservation
            </h2>
            <p className="mt-3">
              [À COMPLÉTER — durée de conservation retenue, par exemple : les
              données liées à une commande sont conservées 3 ans à compter de
              la dernière commande à des fins de relation commerciale, et les
              données de facturation 10 ans conformément aux obligations
              comptables légales].
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">
              6. Vos droits
            </h2>
            <p className="mt-3">
              Conformément au Règlement Général sur la Protection des Données
              (RGPD) et à la loi Informatique et Libertés, vous disposez d&apos;un
              droit d&apos;accès, de rectification, d&apos;effacement, de
              limitation, d&apos;opposition et de portabilité sur vos données
              personnelles. Vous pouvez exercer ces droits en nous contactant à
              smoak.paris@gmail.com. Vous disposez également du
              droit d&apos;introduire une réclamation auprès de la CNIL
              (www.cnil.fr).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">
              7. Sécurité
            </h2>
            <p className="mt-3">
              Nous mettons en œuvre les mesures techniques raisonnables pour
              protéger vos données contre tout accès, altération ou divulgation
              non autorisés.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">
              8. Cookies et stockage local
            </h2>
            <p className="mt-3">
              Le site utilise le stockage local de votre navigateur
              (localStorage) pour conserver le contenu de votre panier. Cette
              donnée reste sur votre appareil, n&apos;est pas transmise à des
              tiers et n&apos;est pas utilisée à des fins de suivi publicitaire.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
