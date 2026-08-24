"use client";

import { use, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import OrderStatusStepper from "@/components/OrderStatusStepper";
import {
  formatSlotLabel,
  getEarlyReturnSlots,
  getReturnTimeLabel,
} from "@/lib/deliverySlots";
import {
  DRIVER_PHONE_DISPLAYS,
  DRIVER_PHONE_NUMBERS,
  SERVICE_PHONE_DISPLAY,
  SERVICE_PHONE_NUMBER,
} from "@/lib/contact";
import { formatOrderReference } from "@/lib/orderNumber";
import type { DeliveryZone } from "@/lib/deliveryZones";

const TrackingMap = dynamic(() => import("@/components/TrackingMap"), {
  ssr: false,
});

interface Point {
  lat: number;
  lng: number;
}

interface RouteInfo {
  distanceMeters: number;
  durationSeconds: number;
  geometry: [number, number][];
}

interface TrackingData {
  orderNumber: number;
  status: string;
  deliverySlot: string | null;
  deliveryZone: DeliveryZone | null;
  earlyReturnSlot: string | null;
  delivery: Point | null;
  driver: (Point & { updatedAt: string | null }) | null;
  route: RouteInfo | null;
}

function formatEta(durationSeconds: number): string {
  const minutes = Math.max(1, Math.round(durationSeconds / 60));
  return minutes === 1 ? "1 min" : `${minutes} min`;
}

function formatDistance(distanceMeters: number): string {
  return distanceMeters < 1000
    ? `${Math.round(distanceMeters)} m`
    : `${(distanceMeters / 1000).toFixed(1)} km`;
}

const POLL_INTERVAL_MS = 5000;

export default function SuiviPage({
  params,
}: PageProps<"/commande/suivi/[id]">) {
  const { id } = use(params);
  const [data, setData] = useState<TrackingData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showEarlyReturnPicker, setShowEarlyReturnPicker] = useState(false);
  const [earlyReturnSubmitting, setEarlyReturnSubmitting] = useState(false);
  const [earlyReturnError, setEarlyReturnError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      const res = await fetch(`/api/commandes/${id}`);
      if (cancelled) return;

      if (!res.ok) {
        setNotFound(true);
        return;
      }
      const next: TrackingData = await res.json();
      setData(next);

      if (next.status !== "livree") {
        timer = setTimeout(poll, POLL_INTERVAL_MS);
      }
    };

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [id]);

  const chooseEarlyReturnSlot = async (slot: string) => {
    setEarlyReturnError(null);
    setEarlyReturnSubmitting(true);
    try {
      const res = await fetch(`/api/commandes/${id}/early-return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error ?? "Une erreur est survenue");
      }
      setData((d) => (d ? { ...d, earlyReturnSlot: slot } : d));
      setShowEarlyReturnPicker(false);
    } catch (err) {
      setEarlyReturnError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setEarlyReturnSubmitting(false);
    }
  };

  if (notFound) {
    return (
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-16 text-center sm:px-6">
        <h1 className="font-serif text-2xl font-semibold text-ink">
          Commande introuvable
        </h1>
        <Link
          href="/commande"
          className="mt-6 inline-block rounded-full bg-signal px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-white hover:bg-signal-hover"
        >
          Retour au menu
        </Link>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-16 text-center sm:px-6">
        <p className="text-sm text-muted">Chargement...</p>
      </main>
    );
  }

  const driverPhone = data.deliveryZone
    ? DRIVER_PHONE_NUMBERS[data.deliveryZone]
    : SERVICE_PHONE_NUMBER;
  const driverPhoneDisplay = data.deliveryZone
    ? DRIVER_PHONE_DISPLAYS[data.deliveryZone]
    : SERVICE_PHONE_DISPLAY;

  const earlyReturnSlots = data.deliverySlot ? getEarlyReturnSlots(data.deliverySlot) : [];

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-serif text-2xl font-semibold text-ink">
        Suivi — commande n° {formatOrderReference(data.orderNumber)}
      </h1>

      <div className="mt-6 rounded-xl border border-border bg-secondary p-5">
        <OrderStatusStepper status={data.status} />
      </div>

      {data.status === "recue" && (
        <Link
          href={`/commande/suivi/${id}/ajouter`}
          className="mt-6 block w-full rounded-full border border-border bg-white px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-secondary"
        >
          Ajouter des articles à ma commande
        </Link>
      )}

      {data.status === "en_livraison" && (
        <div className="mt-6">
          {data.route && (
            <div className="mb-3 flex items-center justify-between rounded-xl bg-signal px-5 py-4 text-white">
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-white/70">
                  Votre livreur arrive
                </p>
                <p className="mt-0.5 font-serif text-2xl">
                  {formatEta(data.route.durationSeconds)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.1em] text-white/70">Distance</p>
                <p className="mt-0.5 font-mono text-lg">
                  {formatDistance(data.route.distanceMeters)}
                </p>
              </div>
            </div>
          )}
          <TrackingMap driver={data.driver} delivery={data.delivery} route={data.route?.geometry} />
          {!data.driver && (
            <p className="mt-2 text-center text-xs text-muted">
              En attente de la position du livreur...
            </p>
          )}
          <a
            href={`tel:${driverPhone}`}
            className="mt-4 inline-block w-full rounded-full bg-signal px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-signal-hover"
          >
            Contacter le livreur — {driverPhoneDisplay}
          </a>
        </div>
      )}

      {data.status === "livree" && (
        <div className="mt-6 rounded-xl border border-border bg-secondary p-5 text-center">
          <p className="text-sm text-muted">
            Votre commande a été livrée. Bon moment ✨
          </p>
          {data.deliverySlot && (
            <p className="mt-2 text-sm font-medium text-ink">
              {data.earlyReturnSlot
                ? `Votre livreur reviendra chercher la chicha à ${formatSlotLabel(data.earlyReturnSlot)}.`
                : `Votre livreur reviendra chercher la chicha à ${getReturnTimeLabel(data.deliverySlot)}.`}
            </p>
          )}

          <a
            href={`tel:${SERVICE_PHONE_NUMBER}`}
            className="mt-4 inline-block w-full rounded-full bg-signal px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-signal-hover"
          >
            Je veux la rendre maintenant — {SERVICE_PHONE_DISPLAY}
          </a>

          {!showEarlyReturnPicker ? (
            <button
              type="button"
              onClick={() => setShowEarlyReturnPicker(true)}
              className="mt-3 block w-full rounded-full border border-border bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-secondary"
            >
              Rendre ma chicha plus tôt
            </button>
          ) : (
            <div className="mt-3 rounded-xl border border-border bg-white p-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                Choisis un créneau
              </p>
              {earlyReturnSlots.length > 0 ? (
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {earlyReturnSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      disabled={earlyReturnSubmitting}
                      onClick={() => chooseEarlyReturnSlot(slot)}
                      className="rounded-lg border border-border px-2 py-2 text-sm text-muted transition-colors hover:border-signal hover:bg-secondary hover:text-ink disabled:opacity-60"
                    >
                      {formatSlotLabel(slot)}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-xs text-muted">
                  Aucun créneau plus tôt disponible — appelle-nous directement.
                </p>
              )}
              {earlyReturnError && (
                <p className="mt-2 text-xs text-red-600" role="alert">
                  {earlyReturnError}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <Link
        href="/commande"
        className="mt-6 block text-center text-xs font-medium text-muted hover:text-ink"
      >
        Retour au menu
      </Link>
    </main>
  );
}
