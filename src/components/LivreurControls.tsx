"use client";

import { useEffect, useRef, useState } from "react";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/orderStatus";

export default function LivreurControls({
  orderId,
  initialStatus,
}: {
  orderId: string;
  initialStatus: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [updating, setUpdating] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const watchId = useRef<number | null>(null);

  const updateStatus = async (next: string) => {
    setUpdating(true);
    const res = await fetch(`/api/commandes/${orderId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setUpdating(false);
    if (res.ok) setStatus(next);
  };

  const sendPosition = (position: GeolocationPosition) => {
    fetch(`/api/commandes/${orderId}/position`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }),
    });
  };

  const toggleSharing = () => {
    if (sharing) {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
      setSharing(false);
      return;
    }

    if (!("geolocation" in navigator)) {
      setGeoError("Géolocalisation non disponible sur cet appareil");
      return;
    }

    setGeoError(null);
    watchId.current = navigator.geolocation.watchPosition(
      sendPosition,
      () => setGeoError("Impossible d'accéder à la position"),
      { enableHighAccuracy: true, maximumAge: 5000 },
    );
    setSharing(true);
  };

  useEffect(() => {
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="rounded-xl border border-border p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
          Statut
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {ORDER_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              disabled={updating || s === status}
              onClick={() => updateStatus(s)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors disabled:opacity-50 ${
                s === status
                  ? "bg-signal text-white"
                  : "border border-border text-ink hover:bg-secondary"
              }`}
            >
              {ORDER_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
          Position en direct
        </h2>
        <p className="mt-2 text-sm text-muted">
          Active le partage pendant la livraison, le client voit ta position sur sa
          page de suivi.
        </p>
        <button
          type="button"
          onClick={toggleSharing}
          className={`mt-3 w-full rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors ${
            sharing
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-signal text-white hover:bg-signal-hover"
          }`}
        >
          {sharing ? "Arrêter le partage" : "Partager ma position"}
        </button>
        {geoError && <p className="mt-2 text-sm text-red-600">{geoError}</p>}
      </div>
    </div>
  );
}
