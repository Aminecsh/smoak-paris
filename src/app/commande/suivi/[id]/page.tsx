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

interface TrackingData {
  orderNumber: number;
  status: string;
  deliverySlot: string | null;
  deliveryZone: DeliveryZone | null;
  earlyReturnSlot: string | null;
  delivery: Point | null;
  driver: (Point & { updatedAt: string | null }) | null;
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
        <h1 className="font-serif text-2xl font-semibold text-brand">
          Commande introuvable
        </h1>
        <Link
          href="/commande"
          className="mt-6 inline-block rounded-full bg-brand px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-white hover:bg-brand-soft"
        >
          Retour au menu
        </Link>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-16 text-center sm:px-6">
        <p className="text-sm text-brand/50">Chargement...</p>
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
      <h1 className="font-serif text-2xl font-semibold text-brand">
        Suivi — commande n° {formatOrderReference(data.orderNumber)}
      </h1>

      <div className="mt-6 rounded-xl border border-brand/10 bg-cream p-5">
        <OrderStatusStepper status={data.status} />
      </div>

      {data.status === "recue" && (
        <Link
          href={`/commande/suivi/${id}/ajouter`}
          className="mt-6 block w-full rounded-full border border-brand/20 bg-white px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.08em] text-brand transition-colors hover:bg-cream"
        >
          Ajouter des articles à ma commande
        </Link>
      )}

      {data.status === "en_livraison" && (
        <div className="mt-6">
          <TrackingMap driver={data.driver} delivery={data.delivery} />
          {!data.driver && (
            <p className="mt-2 text-center text-xs text-brand/50">
              En attente de la position du livreur...
            </p>
          )}
          <a
            href={`tel:${driverPhone}`}
            className="mt-4 inline-block w-full rounded-full bg-brand px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-brand-soft"
          >
            Contacter le livreur — {driverPhoneDisplay}
          </a>
        </div>
      )}

      {data.status === "livree" && (
        <div className="mt-6 rounded-xl border border-brand/10 bg-cream p-5 text-center">
          <p className="text-sm text-brand/60">
            Votre commande a été livrée. Bon moment ✨
          </p>
          {data.deliverySlot && (
            <p className="mt-2 text-sm font-medium text-brand">
              {data.earlyReturnSlot
                ? `Votre livreur reviendra chercher la chicha à ${formatSlotLabel(data.earlyReturnSlot)}.`
                : `Votre livreur reviendra chercher la chicha à ${getReturnTimeLabel(data.deliverySlot)}.`}
            </p>
          )}

          <a
            href={`tel:${SERVICE_PHONE_NUMBER}`}
            className="mt-4 inline-block w-full rounded-full bg-brand px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-brand-soft"
          >
            Je veux la rendre maintenant — {SERVICE_PHONE_DISPLAY}
          </a>

          {!showEarlyReturnPicker ? (
            <button
              type="button"
              onClick={() => setShowEarlyReturnPicker(true)}
              className="mt-3 block w-full rounded-full border border-brand/20 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-brand transition-colors hover:bg-cream"
            >
              Rendre ma chicha plus tôt
            </button>
          ) : (
            <div className="mt-3 rounded-xl border border-brand/10 bg-white p-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand/50">
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
                      className="rounded-lg border border-brand/20 px-2 py-2 text-sm text-brand/70 transition-colors hover:border-brand hover:bg-cream hover:text-brand disabled:opacity-60"
                    >
                      {formatSlotLabel(slot)}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-xs text-brand/50">
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
        className="mt-6 block text-center text-xs font-medium text-brand/50 hover:text-brand"
      >
        Retour au menu
      </Link>
    </main>
  );
}
