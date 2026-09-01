import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { sendTrackingLink } from "@/lib/notifications/sendTrackingLink";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const PHONE_PATTERN = /^\+[1-9]\d{0,3}( \d{1,2})+$/;

// Retrouve la commande la plus récente associée à un numéro de téléphone et
// renvoie le lien de suivi par email — pour un client qui a perdu sa page de
// suivi et n'a plus l'email de confirmation sous la main. Répond toujours
// le même message générique, qu'une commande ait été trouvée ou non, pour
// ne jamais révéler si un numéro donné a déjà commandé.
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`order-lookup:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Trop de tentatives, réessaie dans quelques minutes" },
      { status: 429 },
    );
  }

  const { phone } = await request.json().catch(() => ({ phone: "" }));
  if (typeof phone !== "string" || !PHONE_PATTERN.test(phone.trim())) {
    return NextResponse.json({ error: "Numéro de téléphone invalide" }, { status: 400 });
  }
  const trimmedPhone = phone.trim();

  // Un deuxième palier, par numéro cette fois : même avec des IP différentes,
  // on ne renvoie pas le lien en boucle vers le même client.
  if (!checkRateLimit(`order-lookup:${trimmedPhone}`, 3, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: true });
  }

  const supabase = getSupabaseServerClient();
  const { data: order } = await supabase
    .from("orders")
    .select("id, customer_name, customer_email, customer_phone")
    .eq("customer_phone", trimmedPhone)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ id: string; customer_name: string; customer_email: string; customer_phone: string }>();

  if (order) {
    const trackingUrl = `${request.nextUrl.origin}/commande/suivi/${order.id}`;
    const notification = await sendTrackingLink({
      firstName: order.customer_name.trim().split(" ")[0],
      phone: order.customer_phone,
      email: order.customer_email,
      trackingUrl,
    });
    await supabase
      .from("orders")
      .update({
        notification_channel: notification.channel,
        notification_error: notification.error ?? null,
      })
      .eq("id", order.id);
  }

  return NextResponse.json({ ok: true });
}
