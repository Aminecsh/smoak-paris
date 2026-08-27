"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { products } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { groupSupplementLines } from "@/lib/cartDisplay";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import {
  DELIVERY_SLOTS,
  LAST_RETURN_LABEL,
  SPONTANEOUS_DELIVERY_MINUTES,
  formatSlotLabel,
  getReturnTimeLabel,
  isSlotOrderingOpen,
} from "@/lib/deliverySlots";
import {
  COUNTRY_OPTIONS,
  DEFAULT_COUNTRY,
  formatNationalNumber,
  formatPhoneForStorage,
  isValidNationalNumber,
} from "@/lib/phone";

type PaymentMethod = "cb" | "especes";

interface AddressSelection {
  streetLine: string;
  postalCode: string;
  city: string;
  lat: number;
  lng: number;
}

export default function LivraisonPage() {
  const router = useRouter();
  const { items, configuredChichas, totalPrice, clearCart } = useCart();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dialCode, setDialCode] = useState(DEFAULT_COUNTRY.dialCode);
  const [phoneDigits, setPhoneDigits] = useState("");
  const [street, setStreet] = useState("");
  const [addressSelection, setAddressSelection] = useState<AddressSelection | null>(
    null,
  );
  const [note, setNote] = useState("");
  const [deliverySlot, setDeliverySlot] = useState<string>(DELIVERY_SLOTS[0]);
  const [isSpontaneous] = useState(() => !isSlotOrderingOpen());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("especes");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEmpty = items.length === 0 && configuredChichas.length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidNationalNumber(dialCode, phoneDigits)) {
      setError("Numéro de téléphone invalide pour le pays sélectionné");
      return;
    }
    if (!addressSelection) {
      setError("Choisis une adresse dans la liste proposée (livraison en Île-de-France uniquement)");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/commandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: `${firstName.trim()} ${lastName.trim()}`.trim(),
            email,
            phone: formatPhoneForStorage(dialCode, phoneDigits),
            street: addressSelection.streetLine,
            postalCode: addressSelection.postalCode,
            city: addressSelection.city,
            addressPoint: { lat: addressSelection.lat, lng: addressSelection.lng },
            note,
            paymentMethod,
            deliverySlot: isSpontaneous ? undefined : deliverySlot,
          },
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          configuredChichas: configuredChichas.map((c) => ({
            chichaId: c.chichaId,
            flavorId: c.flavorId,
            secondFlavorId: c.secondFlavorId,
            recharge: c.recharge,
            drinkIds: c.drinks.map((d) => d.id),
            sweetIds: c.sweets.map((s) => s.id),
            quantity: c.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Une erreur est survenue");
      }

      clearCart();
      router.push(`/commande/confirmation/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setSubmitting(false);
    }
  };

  if (isEmpty) {
    return (
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-16 text-center sm:px-6">
        <h1 className="font-serif text-2xl font-semibold text-ink">
          Votre panier est vide
        </h1>
        <p className="mt-2 text-sm text-muted">
          Ajoutez des produits avant de passer commande.
        </p>
        <Link
          href="/commande"
          className="mt-6 inline-block rounded-lg bg-signal px-5 py-2.5 text-xs font-semibold text-white hover:bg-signal-hover"
        >
          Retour au menu
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink">
        Livraison
      </h1>
      <p className="mt-1 text-sm text-muted">
        Renseignez vos coordonnées, paiement à la livraison.
      </p>

      <div className="mt-6 rounded-xl border border-border bg-white p-4">
        <ul className="flex flex-col gap-1.5 text-sm text-muted">
          {configuredChichas.map((c) => (
            <li key={c.id} className="flex justify-between gap-2">
              <span>
                <span className="block">
                  {c.quantity} × {c.chichaName} — {c.flavorName}
                  {c.secondFlavorName ? ` + ${c.secondFlavorName}` : ""}
                </span>
                {(c.recharge || c.drinks.length > 0 || c.sweets.length > 0) && (
                  <span className="mt-0.5 block text-xs text-muted">
                    {[
                      c.recharge ? "Tête en plus" : null,
                      ...groupSupplementLines(c.drinks).map(
                        (drink) => `${drink.quantity > 1 ? `${drink.quantity}× ` : ""}${drink.name}`,
                      ),
                      ...groupSupplementLines(c.sweets).map(
                        (sweet) => `${sweet.quantity > 1 ? `${sweet.quantity}× ` : ""}${sweet.name}`,
                      ),
                    ]
                      .filter(Boolean)
                      .join(" + ")}
                  </span>
                )}
              </span>
              <span className="flex-shrink-0 font-mono font-semibold text-signal">
                {(c.unitPrice * c.quantity).toFixed(2)} €
              </span>
            </li>
          ))}
          {items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return null;
            return (
              <li key={item.productId} className="flex justify-between gap-2">
                <span className="truncate">
                  {item.quantity} × {product.name}
                </span>
                <span className="flex-shrink-0 font-mono font-semibold text-signal">
                  {(product.price * item.quantity).toFixed(2)} €
                </span>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm font-medium text-muted">Total</span>
          <span className="font-mono text-lg font-bold text-signal">
            {totalPrice.toFixed(2)} €
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-muted">
              Prénom
            </label>
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-ink"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted">
              Nom
            </label>
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-ink"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted">
            Email
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-ink"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted">
            Téléphone
          </label>
          <div className="mt-1 flex gap-2">
            <select
              value={dialCode}
              onChange={(e) => setDialCode(e.target.value)}
              className="rounded-lg border border-border bg-white px-2 py-2.5 text-sm text-ink"
            >
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c.code} value={c.dialCode}>
                  {c.flag} +{c.dialCode}
                </option>
              ))}
            </select>
            <input
              required
              type="tel"
              inputMode="numeric"
              value={formatNationalNumber(phoneDigits)}
              onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, ""))}
              placeholder="6 12 34 56 78"
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-ink"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted">
            Adresse
          </label>
          <div className="mt-1">
            <AddressAutocomplete
              value={street}
              onChange={(value) => {
                setStreet(value);
                setAddressSelection(null);
              }}
              onSelect={setAddressSelection}
              placeholder="Numéro et rue"
            />
          </div>
          <p className="mt-1 text-xs text-muted">
            Choisis une adresse dans la liste proposée — livraison en Île-de-France
            uniquement.
          </p>
        </div>

        {addressSelection && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted">
                Code postal
              </label>
              <input
                readOnly
                value={addressSelection.postalCode}
                className="mt-1 w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-muted"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted">
                Ville
              </label>
              <input
                readOnly
                value={addressSelection.city}
                className="mt-1 w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-muted"
              />
            </div>
          </div>
        )}

        {isSpontaneous ? (
          <div className="rounded-lg border border-border bg-secondary p-4">
            <p className="text-sm font-semibold text-ink">
              Livraison spontanée — environ {SPONTANEOUS_DELIVERY_MINUTES} min
            </p>
            <p className="mt-1 text-xs text-muted">
              Les créneaux réservés à l&apos;avance ferment à 21h. Ta commande
              part tout de suite en préparation, livrée en ~
              {SPONTANEOUS_DELIVERY_MINUTES} minutes. La chicha devra être
              restituée 2h après la livraison.
            </p>
          </div>
        ) : (
          <div>
            <label className="text-xs font-semibold text-muted">
              Créneau de livraison
            </label>
            <div className="mt-1 grid grid-cols-4 gap-2">
              {DELIVERY_SLOTS.map((slot) => (
                <label
                  key={slot}
                  className={`flex cursor-pointer items-center justify-center rounded-lg border px-2 py-2 text-sm ${
                    deliverySlot === slot
                      ? "border-signal bg-secondary text-ink"
                      : "border-border text-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliverySlot"
                    value={slot}
                    checked={deliverySlot === slot}
                    onChange={() => setDeliverySlot(slot)}
                    className="sr-only"
                  />
                  {formatSlotLabel(slot)}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">
              La chicha doit être restituée 2h après la livraison (au plus tard à{" "}
              {getReturnTimeLabel(deliverySlot)}, dernière reprise possible à{" "}
              {LAST_RETURN_LABEL}). Après 21h, les créneaux ferment et les
              commandes deviennent spontanées (livrées en ~
              {SPONTANEOUS_DELIVERY_MINUTES} min).
            </p>
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-muted">
            Note pour le livreur (optionnel)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-ink"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted">
            Paiement à la livraison
          </label>
          <div className="mt-1 grid grid-cols-2 gap-3">
            <label
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm ${
                paymentMethod === "cb"
                  ? "border-signal bg-secondary text-ink"
                  : "border-border text-muted"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="cb"
                checked={paymentMethod === "cb"}
                onChange={() => setPaymentMethod("cb")}
                className="h-4 w-4 accent-signal"
              />
              Carte bancaire
            </label>
            <label
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm ${
                paymentMethod === "especes"
                  ? "border-signal bg-secondary text-ink"
                  : "border-border text-muted"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="especes"
                checked={paymentMethod === "especes"}
                onChange={() => setPaymentMethod("especes")}
                className="h-4 w-4 accent-signal"
              />
              Espèces
            </label>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-lg bg-signal px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-signal-hover disabled:opacity-60"
        >
          {submitting ? "Envoi..." : `Confirmer la commande — ${totalPrice.toFixed(2)} €`}
        </button>
      </form>
    </main>
  );
}
