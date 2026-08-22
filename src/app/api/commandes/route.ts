import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/products";
import {
  chichaBases,
  chichaFlavors,
  rechargeSupplement,
  charcoalSupplement,
  extraFlavorSupplement,
  drinkSupplements,
  sweetSupplements,
} from "@/lib/chicha";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { geocodeAddress } from "@/lib/geocode";
import { isDeliverySlot } from "@/lib/deliverySlots";

interface OrderItemInput {
  productId: string;
  quantity: number;
}

interface ConfiguredChichaInput {
  chichaId: string;
  flavorId: string;
  recharge?: boolean;
  extraCharcoal?: boolean;
  extraFlavorId?: string | null;
  drinkIds?: string[];
  sweetIds?: string[];
  quantity: number;
}

interface OrderPayload {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    addressPoint?: { lat: number; lng: number } | null;
    note?: string;
    paymentMethod?: string;
    deliverySlot?: string;
  };
  items: OrderItemInput[];
  configuredChichas: ConfiguredChichaInput[];
}

const VALID_PAYMENT_METHODS = ["cb", "especes"];

interface OrderItemRow {
  kind: "produit" | "chicha";
  name: string;
  unit_price: number;
  quantity: number;
  details: Record<string, unknown> | null;
}

interface StockDecrement {
  id: string;
  name: string;
  quantity: number;
}

interface BuiltOrder {
  itemRows: OrderItemRow[];
  stockDecrements: StockDecrement[];
}

function isPositiveInt(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

// Reconstruit les lignes de commande et les décomptes de stock à partir du
// catalogue serveur — on ne fait jamais confiance aux prix envoyés par le
// client.
function buildOrder(payload: OrderPayload): BuiltOrder | { error: string } {
  const itemRows: OrderItemRow[] = [];
  const stockDecrements: StockDecrement[] = [];

  for (const item of payload.items ?? []) {
    if (!isPositiveInt(item.quantity)) {
      return { error: `Quantité invalide pour ${item.productId}` };
    }
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return { error: `Produit inconnu : ${item.productId}` };
    }
    itemRows.push({
      kind: "produit",
      name: product.name,
      unit_price: product.price,
      quantity: item.quantity,
      details: null,
    });
    stockDecrements.push({
      id: product.id,
      name: product.name,
      quantity: item.quantity,
    });
  }

  for (const chicha of payload.configuredChichas ?? []) {
    if (!isPositiveInt(chicha.quantity)) {
      return { error: "Quantité de chicha invalide" };
    }
    const base = chichaBases.find((c) => c.id === chicha.chichaId);
    if (!base) {
      return { error: `Chicha inconnue : ${chicha.chichaId}` };
    }
    const flavor = chichaFlavors.find((f) => f.id === chicha.flavorId);
    if (!flavor) {
      return { error: `Goût inconnu : ${chicha.flavorId}` };
    }
    const extraFlavor = chicha.extraFlavorId
      ? chichaFlavors.find((f) => f.id === chicha.extraFlavorId)
      : null;
    const drinks = (chicha.drinkIds ?? []).map((id) =>
      drinkSupplements.find((d) => d.id === id),
    );
    if (drinks.some((d) => !d)) {
      return { error: "Boisson en supplément inconnue" };
    }
    const sweets = (chicha.sweetIds ?? []).map((id) =>
      sweetSupplements.find((s) => s.id === id),
    );
    if (sweets.some((s) => !s)) {
      return { error: "Sucrerie en supplément inconnue" };
    }

    const unitPrice =
      base.price +
      (chicha.recharge ? rechargeSupplement.price : 0) +
      (chicha.extraCharcoal ? charcoalSupplement.price : 0) +
      (extraFlavor ? extraFlavorSupplement.price : 0) +
      drinks.reduce((sum, d) => sum + (d?.price ?? 0), 0) +
      sweets.reduce((sum, s) => sum + (s?.price ?? 0), 0);

    itemRows.push({
      kind: "chicha",
      name: `${base.name} — ${flavor.name}`,
      unit_price: unitPrice,
      quantity: chicha.quantity,
      details: {
        flavor: flavor.name,
        recharge: Boolean(chicha.recharge),
        extraCharcoal: Boolean(chicha.extraCharcoal),
        extraFlavor: extraFlavor?.name ?? null,
        drinks: drinks.map((d) => d!.name),
        sweets: sweets.map((s) => s!.name),
      },
    });

    stockDecrements.push({ id: base.id, name: base.name, quantity: chicha.quantity });
    stockDecrements.push({ id: flavor.id, name: flavor.name, quantity: chicha.quantity });
    if (extraFlavor) {
      stockDecrements.push({
        id: extraFlavor.id,
        name: extraFlavor.name,
        quantity: chicha.quantity,
      });
    }
    if (chicha.recharge) {
      stockDecrements.push({
        id: rechargeSupplement.id,
        name: rechargeSupplement.name,
        quantity: chicha.quantity,
      });
    }
    if (chicha.extraCharcoal) {
      stockDecrements.push({
        id: charcoalSupplement.id,
        name: charcoalSupplement.name,
        quantity: chicha.quantity,
      });
    }
    for (const drink of drinks) {
      stockDecrements.push({
        id: drink!.id,
        name: drink!.name,
        quantity: chicha.quantity,
      });
    }
    for (const sweet of sweets) {
      stockDecrements.push({
        id: sweet!.id,
        name: sweet!.name,
        quantity: chicha.quantity,
      });
    }
  }

  if (itemRows.length === 0) {
    return { error: "Le panier est vide" };
  }

  return { itemRows, stockDecrements };
}

export async function POST(request: NextRequest) {
  let payload: OrderPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const { name, email, phone, address, addressPoint, paymentMethod, deliverySlot } =
    payload.customer ?? {};
  if (!name?.trim() || !email?.trim() || !phone?.trim() || !address?.trim()) {
    return NextResponse.json(
      { error: "Nom, email, téléphone et adresse sont obligatoires" },
      { status: 400 },
    );
  }
  if (paymentMethod && !VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    return NextResponse.json({ error: "Moyen de paiement invalide" }, { status: 400 });
  }
  if (!isDeliverySlot(deliverySlot)) {
    return NextResponse.json({ error: "Créneau de livraison invalide" }, { status: 400 });
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
      : await geocodeAddress(address.trim());

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase.rpc("create_order", {
    p_customer_name: name.trim(),
    p_customer_phone: phone.trim(),
    p_delivery_address: address.trim(),
    p_delivery_note: payload.customer.note?.trim() || null,
    p_total_price: totalPrice,
    p_order_items: itemRows,
    p_stock_decrements: stockDecrements,
    p_delivery_lat: geo?.lat ?? null,
    p_delivery_lng: geo?.lng ?? null,
    p_customer_email: email.trim(),
    p_payment_method: paymentMethod ?? "especes",
    p_delivery_slot: deliverySlot,
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

  return NextResponse.json(
    { id: order.id, orderNumber: order.order_number, totalPrice },
    { status: 201 },
  );
}
