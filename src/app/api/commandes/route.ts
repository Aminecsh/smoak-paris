import { NextRequest, NextResponse, after } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { geocodeAddress } from "@/lib/geocode";
import {
  getSpontaneousDeliverySlot,
  isDeliverySlot,
  isSlotOrderingOpen,
  isWithinOpeningHours,
} from "@/lib/deliverySlots";
import { getDeliveryZone, isInIleDeFrance } from "@/lib/deliveryZones";
import {
  buildOrder,
  type ConfiguredChichaInput,
  type OrderItemInput,
} from "@/lib/orderBuilder";
import { sendTrackingLink } from "@/lib/notifications/sendTrackingLink";
import { sendPushToAll } from "@/lib/notifications/push";
import { buildOrderStatusKeyboard, sendTelegramMessage } from "@/lib/notifications/telegram";
import { formatOrderReference } from "@/lib/orderNumber";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// Filet de sécurité : after() (envoi email/push, géocodage de repli) continue
// de tourner après la réponse, dans la limite de ce délai.
export const maxDuration = 30;

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
  try {
    return await handlePost(request);
  } catch (err) {
    // Filet de sécurité : toute exception non prévue ici finissait comme une
    // page d'erreur générique non-JSON côté plateforme, que le client ne
    // pouvait pas parser — d'où un message d'erreur trompeur ("trop de temps
    // à répondre") qui masquait la vraie cause. On journalise la vraie
    // erreur (visible dans les logs Vercel) et on renvoie toujours du JSON.
    console.error("POST /api/commandes a échoué :", err);
    return NextResponse.json(
      { error: "Erreur inattendue, réessaie dans un instant" },
      { status: 500 },
    );
  }
}

async function handlePost(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`create-order:${ip}`, 8, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Trop de commandes envoyées, réessayez dans quelques minutes" },
      { status: 429 },
    );
  }

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
  // L'heure serveur (Paris) fait foi, pas celle du client. Le client demande
  // soit un créneau précis (deliverySlot fourni — fermé après 21h), soit la
  // livraison immédiate (deliverySlot absent — fermée en dehors de 18h-4h) ;
  // chaque mode a sa propre fenêtre, indépendamment de ce qu'affichait le
  // client au moment de l'envoi.
  let resolvedDeliverySlot: string;
  if (deliverySlot !== undefined) {
    if (!isSlotOrderingOpen()) {
      return NextResponse.json(
        { error: "Les créneaux précis sont fermés pour ce soir" },
        { status: 400 },
      );
    }
    if (!isDeliverySlot(deliverySlot)) {
      return NextResponse.json({ error: "Créneau de livraison invalide" }, { status: 400 });
    }
    resolvedDeliverySlot = deliverySlot;
  } else {
    if (!isWithinOpeningHours()) {
      return NextResponse.json(
        { error: "Livraison dès que possible indisponible en dehors de nos horaires" },
        { status: 400 },
      );
    }
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
  // coordonnées fiables. Sinon, on crée la commande sans coordonnées et on
  // géocode l'adresse tapée en repli après coup (via after()) — l'appel
  // externe ne doit jamais retarder la réponse au client.
  const hasReliableGeo =
    addressPoint && Number.isFinite(addressPoint.lat) && Number.isFinite(addressPoint.lng);
  const geo = hasReliableGeo ? addressPoint : null;

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

  // L'envoi de l'email de suivi et la notification push aux livreurs ne
  // doivent pas retarder la réponse au client — surtout sur mobile où la
  // latence cumulée (géocodage + RPC + email + push) pouvait dépasser le
  // délai de la fonction serverless et faire échouer la commande.
  after(async () => {
    if (!hasReliableGeo) {
      const fallbackGeo = await geocodeAddress(
        `${street.trim()}, ${postalCode.trim()} ${city.trim()}`,
      );
      if (fallbackGeo) {
        await supabase
          .from("orders")
          .update({ delivery_lat: fallbackGeo.lat, delivery_lng: fallbackGeo.lng })
          .eq("id", order.id);
      }
    }

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

    await sendTelegramMessage(
      [
        `🔔 Nouvelle commande ${formatOrderReference(order.order_number)}`,
        `${totalPrice.toFixed(2)} € — ${paymentMethod === "cb" ? "CB" : "Espèces"}`,
        `${name.trim()} — ${street.trim()}, ${postalCode.trim()} ${city.trim()}`,
        `${request.nextUrl.origin}/livreur/${order.id}`,
      ].join("\n"),
      { replyMarkup: buildOrderStatusKeyboard(order.id, "recue") },
    );
  });

  return NextResponse.json(
    {
      id: order.id,
      orderNumber: order.order_number,
      totalPrice,
    },
    { status: 201 },
  );
}
