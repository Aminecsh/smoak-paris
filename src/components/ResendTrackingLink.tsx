"use client";

import { useState } from "react";
import {
  COUNTRY_OPTIONS,
  DEFAULT_COUNTRY,
  formatNationalNumber,
  formatPhoneForStorage,
  isValidNationalNumber,
} from "@/lib/phone";

export default function ResendTrackingLink({
  orderId,
  initialChannel,
}: {
  orderId: string;
  initialChannel: "whatsapp" | "email" | "failed" | null;
}) {
  const [channel, setChannel] = useState(initialChannel);
  const [editing, setEditing] = useState(false);
  const [dialCode, setDialCode] = useState(DEFAULT_COUNTRY.dialCode);
  const [phoneDigits, setPhoneDigits] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resend = async (phone?: string) => {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/commandes/${orderId}/resend-tracking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(phone ? { phone } : {}),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Une erreur est survenue");
      }
      setChannel(data.channel);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCorrect = () => {
    if (!isValidNationalNumber(dialCode, phoneDigits)) {
      setError("Numéro de téléphone invalide pour le pays sélectionné");
      return;
    }
    resend(formatPhoneForStorage(dialCode, phoneDigits));
  };

  if (channel === "whatsapp") {
    return (
      <p className="mt-2 text-xs text-brand/50">
        Lien de suivi envoyé sur WhatsApp ✅
      </p>
    );
  }

  return (
    <div className="mt-2 rounded-lg border border-brand/10 bg-white p-3 text-xs text-brand/60">
      {channel === "email" ? (
        <p>Pas de WhatsApp trouvé — le lien de suivi vous a été envoyé par email.</p>
      ) : (
        <p>Le lien de suivi n&apos;a pas pu être envoyé.</p>
      )}

      {!editing ? (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mt-2 font-semibold text-brand underline"
        >
          Mauvais numéro ? Corrige-le
        </button>
      ) : (
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex gap-2">
            <select
              value={dialCode}
              onChange={(e) => setDialCode(e.target.value)}
              className="rounded-lg border border-brand/20 bg-white px-2 py-2 text-sm text-brand"
            >
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c.code} value={c.dialCode}>
                  {c.flag} +{c.dialCode}
                </option>
              ))}
            </select>
            <input
              type="tel"
              inputMode="numeric"
              value={formatNationalNumber(phoneDigits)}
              onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, ""))}
              placeholder="6 12 34 56 78"
              className="w-full rounded-lg border border-brand/20 bg-white px-3 py-2 text-sm text-brand"
            />
          </div>
          <button
            type="button"
            onClick={handleCorrect}
            disabled={submitting}
            className="rounded-full bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white hover:bg-brand-soft disabled:opacity-60"
          >
            {submitting ? "Envoi..." : "Renvoyer le lien"}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-2 text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
