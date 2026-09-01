"use client";

import { use, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import OrderStatusStepper from "@/components/OrderStatusStepper";
import {
  DRIVER_PHONE_DISPLAYS,
  DRIVER_PHONE_NUMBERS,
  SERVICE_PHONE_DISPLAY,
  SERVICE_PHONE_NUMBER,
  SERVICE_WHATSAPP_NUMBER,
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
  const [returnRequested, setReturnRequested] = useState(false);
  const [returnRequesting, setReturnRequesting] = useState(false);
  const [returnError, setReturnError] = useState<string | null>(null);

  const requestReturn = async () => {
    setReturnError(null);
    setReturnRequesting(true);
    try {
      const res = await fetch(`/api/commandes/${id}/request-return`, { method: "POST" });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error ?? "Une erreur est survenue");
      }
      setReturnRequested(true);
    } catch (err) {
      setReturnError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setReturnRequesting(false);
    }
  };

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

  if (notFound) {
    return (
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-16 text-center sm:px-6">
        <h1 className="font-serif text-2xl font-semibold text-ink">
          Commande introuvable
        </h1>
        <Link
          href="/commande"
          className="mt-6 inline-block rounded-lg bg-signal px-5 py-2.5 text-xs font-semibold text-white hover:bg-signal-hover"
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
          className="mt-6 block w-full rounded-lg border border-border bg-white px-5 py-3 text-center text-xs font-semibold text-ink transition-colors hover:bg-secondary"
        >
          Ajouter des articles à ma commande
        </Link>
      )}

      {data.status === "en_livraison" && (
        <div className="mt-6">
          {data.route && (
            <div className="mb-3 flex items-center justify-between rounded-xl bg-signal px-5 py-4 text-white">
              <div>
                <p className="text-xs text-white/70">
                  Votre livreur arrive
                </p>
                <p className="mt-0.5 font-serif text-2xl">
                  {formatEta(data.route.durationSeconds)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/70">Distance</p>
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
            className="mt-4 inline-block w-full rounded-lg bg-signal px-5 py-3 text-center text-xs font-semibold text-white transition-colors hover:bg-signal-hover"
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

          {returnRequested ? (
            <p className="mt-4 rounded-lg bg-white px-5 py-3 text-xs font-semibold text-ink">
              Demande envoyée ✅ — l&apos;équipe arrive bientôt récupérer le matériel.
            </p>
          ) : (
            <button
              type="button"
              onClick={requestReturn}
              disabled={returnRequesting}
              className="mt-4 block w-full rounded-lg bg-signal px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-signal-hover disabled:opacity-60"
            >
              {returnRequesting ? "Envoi..." : "Je veux la rendre maintenant"}
            </button>
          )}
          {returnError && (
            <p className="mt-2 text-xs text-red-600" role="alert">
              {returnError}
            </p>
          )}

          <a
            href={`https://wa.me/${SERVICE_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-xs font-medium text-muted underline hover:text-ink"
          >
            Ou écris-nous sur WhatsApp
          </a>
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
