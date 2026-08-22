import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { getEarlyReturnSlots } from "@/lib/deliverySlots";

// Permet au client de demander une reprise de la chicha plus tôt que
// l'heure limite, une fois la commande livrée.
export async function POST(
  request: Request,
  ctx: RouteContext<"/api/commandes/[id]/early-return">,
) {
  const { id } = await ctx.params;

  let body: { slot?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const slot = body.slot;
  if (!slot || !/^\d{2}:\d{2}$/.test(slot)) {
    return NextResponse.json({ error: "Créneau invalide" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("status, delivery_slot")
    .eq("id", id)
    .single<{ status: string; delivery_slot: string | null }>();

  if (fetchError || !order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }
  if (order.status !== "livree") {
    return NextResponse.json(
      { error: "La commande n'est pas encore livrée" },
      { status: 409 },
    );
  }
  if (!order.delivery_slot || !getEarlyReturnSlots(order.delivery_slot).includes(slot)) {
    return NextResponse.json({ error: "Créneau indisponible" }, { status: 400 });
  }

  const { error } = await supabase
    .from("orders")
    .update({ early_return_slot: slot })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, slot });
}
