import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { sendTelegramMessage } from "@/lib/notifications/telegram";
import { formatOrderReference } from "@/lib/orderNumber";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// Le client demande la reprise de sa chicha depuis sa page de suivi, une
// fois la commande livrée — notifie l'équipe sur Telegram immédiatement,
// sans dépendre d'un appel téléphonique qui pourrait ne jamais aboutir.
export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/commandes/[id]/request-return">,
) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`request-return:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Trop de tentatives, réessaie dans quelques instants" },
      { status: 429 },
    );
  }

  const { id } = await ctx.params;
  const supabase = getSupabaseServerClient();

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("order_number, status, customer_name, customer_phone, delivery_address, return_requested_at")
    .eq("id", id)
    .single<{
      order_number: number;
      status: string;
      customer_name: string;
      customer_phone: string;
      delivery_address: string;
      return_requested_at: string | null;
    }>();

  if (fetchError || !order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }
  if (order.status !== "livree") {
    return NextResponse.json(
      { error: "La commande n'est pas encore marquée comme livrée" },
      { status: 409 },
    );
  }

  // Déjà demandé : on ne renvoie pas de notif en boucle si le client
  // reclique plusieurs fois, mais on confirme quand même côté client.
  if (order.return_requested_at) {
    return NextResponse.json({ ok: true, alreadyRequested: true });
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({ return_requested_at: new Date().toISOString() })
    .eq("id", id);
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  await sendTelegramMessage(
    [
      `🔁 Reprise demandée — ${formatOrderReference(order.order_number)}`,
      `${order.customer_name} — ${order.customer_phone}`,
      `📍 ${order.delivery_address}`,
      `${request.nextUrl.origin}/livreur/${id}`,
    ].join("\n"),
  );

  return NextResponse.json({ ok: true, alreadyRequested: false });
}
