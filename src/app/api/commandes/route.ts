import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { geocodeAddress } from "@/lib/geocode";
import {
  getSpontaneousDeliverySlot,
  isDeliverySlot,
  isSlotOrderingOpen,
} from "@/lib/deliverySlots";
import { getDeliveryZone, isInIleDeFrance } from "@/lib/deliveryZones";
import {
  buildOrder,
  type ConfiguredChichaInput,
  type OrderItemInput,
} from "@/lib/orderBuilder";
import { sendTrackingLink } from "@/lib/notifications/sendTrackingLink";
import { sendPushToAll } from "@/lib/notifications/push";
import { formatOrderReference } from "@/lib/orderNumber";

interface OrderPayload {
  customer: {
    name: string;
    email: string;
    phone: string;
    street: string;
    postalCode: string;
    city: string;
    addressPoint?: { lat: number; lng: number } | null;
    note?: string;
    paymentMethod?: string;
    deliverySlot?: string;
  };
  items: OrderItemInput[];
  configuredChichas: ConfiguredChichaInput[];
}

const VALID_PAYMENT_METHODS = ["cb", "especes"];
const PHONE_PATTERN = /^\+[1-9]\d{0,3}( \d{1,2})+$/;
const POSTAL_CODE_PATTERN = /^\d{5}$/;

export async function POST(request: NextRequest) {
  let payload: OrderPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const { name, email, phone, street, postalCode, city, addressPoint, paymentMethod, deliverySlot } =
    payload.customer ?? {};
  if (
    !name?.trim() ||
    !email?.trim() ||
    !phone?.trim() ||
    !street?.trim() ||
    !postalCode?.trim() ||
    !city?.trim()
  ) {
    return NextResponse.json(
      { error: "Nom, email, téléphone et adresse complète sont obligatoires" },
      { status: 400 },
    );
  }
  if (!PHONE_PATTERN.test(phone.trim())) {
    return NextResponse.json({ error: "Numéro de téléphone invalide" }, { status: 400 });
  }
  if (!POSTAL_CODE_PATTERN.test(postalCode.trim())) {
    return NextResponse.json({ error: "Code postal invalide" }, { status: 400 });
  }
  if (!isInIleDeFrance(postalCode.trim())) {
    return NextResponse.json(
      { error: "Nous livrons uniquement en Île-de-France" },
      { status: 400 },
    );
  }
  const deliveryZone = getDeliveryZone(postalCode.trim());
  if (!deliveryZone) {
    return NextResponse.json(
      { error: "Impossible de déterminer le secteur de livraison" },
      { status: 400 },
    );
  }
  if (paymentMethod && !VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    return NextResponse.json({ error: "Moyen de paiement invalide" }, { status: 400 });
  }
  // L'heure serveur fait foi (pas celle du client) : avant 21h on exige un
  // créneau valide parmi la liste ; à partir de 21h, la commande est
  // spontanée et l'heure de livraison est calculée ici, quoi qu'ait envoyé
  // le client.
  let resolvedDeliverySlot: string;
  if (isSlotOrderingOpen()) {
    if (!isDeliverySlot(deliverySlot)) {
      return NextResponse.json({ error: "Créneau de livraison invalide" }, { status: 400 });
    }
    resolvedDeliverySlot = deliverySlot;
  } else {
    resolvedDeliverySlot = getSpontaneousDeliverySlot();
  }

  const built = buildOrder(payload);
  if ("error" in built) {
    return NextResponse.json({ error: built.error }, { status: 400 });
  }
  const { itemRows, stockDecrements } = built;

  const totalPrice = itemRows.reduce(
    (sum, row) => sum + row.unit_price * row.quantity,
    0,
  );

  // Si le client a choisi une suggestion de l'autocomplétion, on a déjà des
  // coordonnées fiables — sinon on géocode l'adresse tapée en repli.
  const geo =
    addressPoint && Number.isFinite(addressPoint.lat) && Number.isFinite(addressPoint.lng)
      ? addressPoint
      : await geocodeAddress(`${street.trim()}, ${postalCode.trim()} ${city.trim()}`);

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase.rpc("create_order", {
    p_customer_name: name.trim(),
    p_customer_phone: phone.trim(),
    p_delivery_address: street.trim(),
    p_delivery_note: payload.customer.note?.trim() || null,
    p_total_price: totalPrice,
    p_order_items: itemRows,
    p_stock_decrements: stockDecrements,
    p_delivery_lat: geo?.lat ?? null,
    p_delivery_lng: geo?.lng ?? null,
    p_customer_email: email.trim(),
    p_payment_method: paymentMethod ?? "especes",
    p_delivery_slot: resolvedDeliverySlot,
    p_postal_code: postalCode.trim(),
    p_city: city.trim(),
    p_delivery_zone: deliveryZone,
  });

  if (error) {
    const isStockError = error.message?.includes("Stock insuffisant");
    return NextResponse.json(
      { error: error.message },
      { status: isStockError ? 409 : 500 },
    );
  }

  const order = data?.[0];
  if (!order) {
    return NextResponse.json(
      { error: "Erreur lors de la création de la commande" },
      { status: 500 },
    );
  }

  const trackingUrl = `${request.nextUrl.origin}/commande/suivi/${order.id}`;
  const notification = await sendTrackingLink({
    firstName: name.trim().split(" ")[0],
    phone: phone.trim(),
    email: email.trim(),
    trackingUrl,
  });

  await supabase
    .from("orders")
    .update({
      notification_channel: notification.channel,
      notification_error: notification.error ?? null,
    })
    .eq("id", order.id);

  await sendPushToAll({
    title: "Nouvelle commande",
    body: `${formatOrderReference(order.order_number)} — ${totalPrice.toFixed(2)} €`,
    url: `/livreur/${order.id}`,
  });

  return NextResponse.json(
    {
      id: order.id,
      orderNumber: order.order_number,
      totalPrice,
      notificationChannel: notification.channel,
    },
    { status: 201 },
  );
}
