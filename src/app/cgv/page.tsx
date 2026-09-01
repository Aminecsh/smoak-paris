import { SERVICE_PHONE_DISPLAY, SERVICE_WHATSAPP_NUMBER } from "@/lib/contact";
import { DELIVERY_SLOTS, OPENING_HOURS_LABEL, formatSlotLabel } from "@/lib/deliverySlots";

export default function CgvPage() {
  return (
    <main className="flex flex-1 flex-col bg-surface">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-6 sm:py-20">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
          Conditions
        </span>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Conditions générales de vente
        </h1>
        <p className="mt-2 text-sm text-muted">Dernière mise à jour : 26 août 2026.</p>

        <div className="mt-10 flex flex-col gap-10 text-sm leading-relaxed text-muted">
          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">
              1. Objet et champ d&apos;application
            </h2>
            <p className="mt-3">
              Les présentes conditions générales de vente (CGV) régissent les
              commandes passées sur le site Smoak Paris, exploité par{" "}
              <strong className="text-ink">Smoak Paris</strong>. Toute
              commande implique l&apos;acceptation sans réserve des présentes
              CGV.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">
              2. Produits proposés
            </h2>
            <p className="mt-3">
              Smoak Paris propose la mise à disposition temporaire de chichas
              (narguilés) prêtes à l&apos;usage — sans tabac ni nicotine — ainsi
              que des boissons et confiseries en vente ferme. La chicha reste la
              propriété de Smoak Paris et doit être restituée à l&apos;issue de
              la session, dans les conditions décrites à l&apos;article 6.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">
              3. Vente réservée aux personnes majeures
            </h2>
            <p className="mt-3">
              La commande est réservée aux personnes majeures. Un justificatif
              d&apos;identité pourra être demandé par le livreur à la remise de
              la commande ; à défaut ou en cas de doute sur l&apos;âge du client,
              la livraison pourra être refusée.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">4. Prix</h2>
            <p className="mt-3">
              Les prix sont indiqués en euros, toutes taxes comprises (TTC).
              Smoak Paris se réserve le droit de modifier ses prix à tout
              moment ; les produits sont facturés sur la base des tarifs en
              vigueur au moment de la validation de la commande.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">
              5. Commande, livraison et créneaux
            </h2>
            <p className="mt-3">
              Les commandes sont passées en ligne et livrées en Île-de-France,
              soit dès que possible pendant les horaires d&apos;ouverture du
              service ({OPENING_HOURS_LABEL}), soit à un créneau précis choisi
              par le client parmi les créneaux disponibles (
              {formatSlotLabel(DELIVERY_SLOTS[0])} —{" "}
              {formatSlotLabel(DELIVERY_SLOTS[DELIVERY_SLOTS.length - 1])},
              réservable jusqu&apos;à 21h). Un lien de suivi est transmis au
              client pour suivre sa commande en temps réel. Smoak Paris
              s&apos;efforce de respecter les délais annoncés mais ne saurait
              être tenu responsable de retards liés à des circonstances hors
              de son contrôle (circulation, conditions météorologiques, etc.).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">
              6. Restitution du matériel
            </h2>
            <p className="mt-3">
              Une caution de 10€ est demandée à la livraison. Elle est
              intégralement rendue au client lors de la reprise du matériel
              par le livreur. La chicha livrée doit être restituée au livreur
              environ 2 heures après la livraison, sauf reprise anticipée
              demandée par le client. Si le matériel est rendu cassé ou
              endommagé, ou s&apos;il n&apos;est pas restitué (matériel
              disparu), la caution est conservée par Smoak Paris.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">7. Paiement</h2>
            <p className="mt-3">
              Le règlement s&apos;effectue à la livraison, par carte bancaire ou
              en espèces, au choix du client indiqué lors de la commande. Des
              articles supplémentaires peuvent être ajoutés à une commande déjà
              passée tant qu&apos;elle n&apos;est pas encore en préparation ; le
              montant correspondant est ajouté au règlement dû à la livraison.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">
              8. Droit de rétractation
            </h2>
            <p className="mt-3">
              Conformément à l&apos;article L221-28 du Code de la consommation,
              le droit de rétractation ne s&apos;applique pas aux biens
              susceptibles de se détériorer ou de se périmer rapidement (boissons,
              confiseries) ni aux prestations de service pleinement exécutées
              avant la fin du délai de rétractation avec l&apos;accord du client
              (mise à disposition immédiate de la chicha).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">
              9. Réclamations et médiation
            </h2>
            <p className="mt-3">
              Pour toute question ou réclamation, le client peut contacter
              Smoak Paris via WhatsApp (
              <a
                href={`https://wa.me/${SERVICE_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline"
              >
                wa.me/{SERVICE_WHATSAPP_NUMBER}
              </a>
              ) ou par téléphone au {SERVICE_PHONE_DISPLAY}. Conformément à
              l&apos;article L616-1 du Code de la consommation, en cas de litige
              non résolu, le client peut recourir gratuitement au médiateur de
              la consommation désigné : Lucie Nawen.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">
              10. Données personnelles
            </h2>
            <p className="mt-3">
              Les données transmises lors de la commande sont traitées
              conformément à notre{" "}
              <a href="/confidentialite" className="text-ink underline">
                politique de confidentialité
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-ink">
              11. Droit applicable
            </h2>
            <p className="mt-3">
              Les présentes CGV sont soumises au droit français. À défaut de
              résolution amiable, les tribunaux français seront seuls
              compétents.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
