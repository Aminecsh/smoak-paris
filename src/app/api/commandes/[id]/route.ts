import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import type { DeliveryZone } from "@/lib/deliveryZones";
import { getDrivingRoute } from "@/lib/routing";

interface TrackedOrder {
  order_number: number;
  status: string;
  delivery_lat: number | null;
  delivery_lng: number | null;
  driver_lat: number | null;
  driver_lng: number | null;
  driver_updated_at: string | null;
  delivery_slot: string | null;
  delivery_zone: DeliveryZone | null;
  early_return_slot: string | null;
}

// Endpoint public (id = UUID non devinable) : uniquement les infos utiles au
// suivi, jamais le nom/téléphone/adresse en clair.
export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/commandes/[id]">,
) {
  const { id } = await ctx.params;
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      "order_number, status, delivery_lat, delivery_lng, driver_lat, driver_lng, driver_updated_at, delivery_slot, delivery_zone, early_return_slot",
    )
    .eq("id", id)
    .single<TrackedOrder>();

  if (error || !data) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  const delivery =
    data.delivery_lat != null && data.delivery_lng != null
      ? { lat: data.delivery_lat, lng: data.delivery_lng }
      : null;
  const driver =
    data.driver_lat != null && data.driver_lng != null
      ? { lat: data.driver_lat, lng: data.driver_lng, updatedAt: data.driver_updated_at }
      : null;

  const route =
    data.status === "en_livraison" && driver && delivery
      ? await getDrivingRoute(driver, delivery)
      : null;

  return NextResponse.json({
    orderNumber: data.order_number,
    status: data.status,
    deliverySlot: data.delivery_slot,
    deliveryZone: data.delivery_zone,
    earlyReturnSlot: data.early_return_slot,
    delivery,
    driver,
    route,
  });
}
