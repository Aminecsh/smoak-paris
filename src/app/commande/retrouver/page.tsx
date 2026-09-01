"use client";

import { useState } from "react";
import Link from "next/link";
import {
  COUNTRY_OPTIONS,
  DEFAULT_COUNTRY,
  formatNationalNumber,
  formatPhoneForStorage,
  isValidNationalNumber,
} from "@/lib/phone";

export default function RetrouverCommandePage() {
  const [dialCode, setDialCode] = useState(DEFAULT_COUNTRY.dialCode);
  const [phoneDigits, setPhoneDigits] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidNationalNumber(dialCode, phoneDigits)) {
      setError("Numéro de téléphone invalide pour le pays sélectionné");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/commandes/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formatPhoneForStorage(dialCode, phoneDigits) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Une erreur est survenue");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-16 text-center sm:px-6">
        <span className="text-3xl">📬</span>
        <h1 className="mt-3 font-serif text-2xl font-semibold text-ink">
          Vérifie tes emails
        </h1>
        <p className="mt-2 text-sm text-muted">
          Si une commande est associée à ce numéro, tu vas recevoir un lien
          de suivi par email d&apos;ici quelques instants.
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
    <main className="mx-auto w-full max-w-md flex-1 px-4 py-16 sm:px-6">
      <h1 className="font-serif text-2xl font-semibold text-ink">
        Retrouver ma commande
      </h1>
      <p className="mt-1 text-sm text-muted">
        Entre le numéro utilisé lors de la commande, on t&apos;envoie à
        nouveau le lien de suivi par email.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
          {submitting ? "Envoi..." : "Recevoir le lien de suivi"}
        </button>
      </form>
    </main>
  );
}
