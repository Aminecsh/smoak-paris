"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StockLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/stock/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Erreur de connexion");
      setSubmitting(false);
      return;
    }

    router.refresh();
  };

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-serif text-2xl font-semibold text-ink">Gestion des stocks</h1>
      <p className="mt-1 text-sm text-muted">Accès protégé.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
        <input
          type="password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-ink"
        />
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-signal px-5 py-2.5 text-xs font-semibold text-white hover:bg-signal-hover disabled:opacity-60"
        >
          {submitting ? "..." : "Entrer"}
        </button>
      </form>
    </main>
  );
}
