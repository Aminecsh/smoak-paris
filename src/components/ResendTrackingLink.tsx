"use client";

import { useState } from "react";

export default function ResendTrackingLink({
  orderId,
  initialChannel,
}: {
  orderId: string;
  initialChannel: "email" | "failed" | null;
}) {
  const [channel, setChannel] = useState(initialChannel);
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resend = async (newEmail?: string) => {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/commandes/${orderId}/resend-tracking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmail ? { email: newEmail } : {}),
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Adresse email invalide");
      return;
    }
    resend(email);
  };

  if (channel === "email") {
    return (
      <p className="mt-2 text-xs text-muted">
        Lien de suivi envoyé par email ✅
      </p>
    );
  }

  if (channel === null) {
    return (
      <p className="mt-2 text-xs text-muted">
        Envoi du lien de suivi en cours...
      </p>
    );
  }

  return (
    <div className="mt-2 rounded-lg border border-border bg-white p-3 text-xs text-muted">
      <p>Le lien de suivi n&apos;a pas pu être envoyé par email.</p>

      {!editing ? (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mt-2 font-semibold text-ink underline"
        >
          Mauvaise adresse ? Corrige-la
        </button>
      ) : (
        <div className="mt-2 flex flex-col gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink"
          />
          <button
            type="button"
            onClick={handleCorrect}
            disabled={submitting}
            className="rounded-lg bg-signal px-4 py-2 text-xs font-semibold text-white hover:bg-signal-hover disabled:opacity-60"
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
