"use client";

import { use, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import OrderStatusStepper from "@/components/OrderStatusStepper";
import { getReturnTimeLabel } from "@/lib/deliverySlots";
import { SERVICE_PHONE_NUMBER, SERVICE_PHONE_DISPLAY } from "@/lib/contact";

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

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-serif text-2xl font-semibold text-brand">
        Suivi — commande n° {data.orderNumber}
      </h1>

      <div className="mt-6 rounded-xl border border-brand/10 bg-cream p-5">
        <OrderStatusStepper status={data.status} />
      </div>

      {data.status === "en_livraison" && (
        <div className="mt-6">
          <TrackingMap driver={data.driver} delivery={data.delivery} />
          {!data.driver && (
            <p className="mt-2 text-center text-xs text-brand/50">
              En attente de la position du livreur...
            </p>
          )}
        </div>
      )}

      {data.status === "livree" && (
        <div className="mt-6 rounded-xl border border-brand/10 bg-cream p-5 text-center">
          <p className="text-sm text-brand/60">
            Votre commande a été livrée. Bon moment ✨
          </p>
          {data.deliverySlot && (
            <p className="mt-2 text-sm font-medium text-brand">
              Votre chicha doit être rendue à {getReturnTimeLabel(data.deliverySlot)}.
            </p>
          )}
          <a
            href={`tel:${SERVICE_PHONE_NUMBER}`}
            className="mt-4 inline-block w-full rounded-full bg-brand px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-brand-soft"
          >
            Je veux la rendre maintenant — {SERVICE_PHONE_DISPLAY}
          </a>
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
