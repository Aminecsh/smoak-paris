"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

type Status = "loading" | "unsupported" | "needs-install" | "off" | "on" | "denied";

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export default function PushSubscribeButton() {
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setStatus("unsupported");
        return;
      }
      if (isIos() && !isStandalone()) {
        setStatus("needs-install");
        return;
      }
      if (Notification.permission === "denied") {
        setStatus("denied");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      const existing = await registration.pushManager.getSubscription();
      setStatus(existing ? "on" : "off");
    };

    check().catch(() => setStatus("unsupported"));
  }, []);

  const subscribe = async () => {
    setError(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error("Notifications non configurées");
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });
      if (!res.ok) {
        throw new Error("Erreur lors de l'inscription");
      }

      setStatus("on");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  if (status === "loading") return null;

  if (status === "on") {
    return (
      <p className="mb-4 text-xs font-medium text-muted">
        Notifications activées sur cet appareil ✅
      </p>
    );
  }

  if (status === "needs-install") {
    return (
      <p className="mb-4 rounded-lg border border-border bg-secondary p-3 text-xs text-muted">
        Pour recevoir les notifications sur iPhone : ouvre ce site dans Safari,
        appuie sur le bouton Partager, puis « Sur l&apos;écran d&apos;accueil ».
        Reviens ensuite ici depuis l&apos;icône ajoutée.
      </p>
    );
  }

  if (status === "denied") {
    return (
      <p className="mb-4 text-xs text-muted">
        Notifications bloquées — autorise-les dans les réglages de ton
        navigateur pour ce site.
      </p>
    );
  }

  if (status === "unsupported") {
    return null;
  }

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={subscribe}
        className="rounded-lg bg-signal px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-signal-hover"
      >
        Activer les notifications de commande
      </button>
      {error && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
