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
    phone: string;
    address: string;
    note?: string;
  };
  items: OrderItemInput[];
  configuredChichas: ConfiguredChichaInput[];
}

interface OrderItemRow {
  kind: "produit" | "chicha";
  name: string;
  unit_price: number;
  quantity: number;
  details: Record<string, unknown> | null;
}

function isPositiveInt(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

// Reconstruit les lignes de commande à partir du catalogue serveur — on ne
// fait jamais confiance aux prix envoyés par le client.
function buildOrderItems(payload: OrderPayload): OrderItemRow[] | { error: string } {
  const rows: OrderItemRow[] = [];

  for (const item of payload.items ?? []) {
    if (!isPositiveInt(item.quantity)) {
      return { error: `Quantité invalide pour ${item.productId}` };
    }
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return { error: `Produit inconnu : ${item.productId}` };
    }
    rows.push({
      kind: "produit",
      name: product.name,
      unit_price: product.price,
      quantity: item.quantity,
      details: null,
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

    rows.push({
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
  }

  if (rows.length === 0) {
    return { error: "Le panier est vide" };
  }

  return rows;
}

export async function POST(request: NextRequest) {
  let payload: OrderPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const { name, phone, address } = payload.customer ?? {};
  if (!name?.trim() || !phone?.trim() || !address?.trim()) {
    return NextResponse.json(
      { error: "Nom, téléphone et adresse sont obligatoires" },
      { status: 400 },
    );
  }

  const itemRows = buildOrderItems(payload);
  if ("error" in itemRows) {
    return NextResponse.json({ error: itemRows.error }, { status: 400 });
  }

  const totalPrice = itemRows.reduce(
    (sum, row) => sum + row.unit_price * row.quantity,
    0,
  );

  const supabase = getSupabaseServerClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      delivery_address: address.trim(),
      delivery_note: payload.customer.note?.trim() || null,
      payment_method: "a_la_livraison",
      status: "recue",
      total_price: totalPrice,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: orderError?.message ?? "Erreur lors de la création de la commande" },
      { status: 500 },
    );
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    itemRows.map((row) => ({ ...row, order_id: order.id })),
  );

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  return NextResponse.json(
    { id: order.id, orderNumber: order.order_number, totalPrice },
    { status: 201 },
  );
}
