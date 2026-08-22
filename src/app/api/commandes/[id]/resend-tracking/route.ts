import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { sendTrackingLink } from "@/lib/notifications/sendTrackingLink";

const PHONE_PATTERN = /^\+[1-9]\d{0,3}( \d{1,2})+$/;

// Permet au client de corriger son numéro (s'il n'a pas reçu le lien
// WhatsApp car ce n'était pas le bon) et de renvoyer le lien de suivi.
export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/commandes/[id]/resend-tracking">,
) {
  const { id } = await ctx.params;

  let body: { phone?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("customer_name, customer_email, customer_phone")
    .eq("id", id)
    .single<{ customer_name: string; customer_email: string; customer_phone: string }>();

  if (fetchError || !order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  let phone = order.customer_phone;
  if (body.phone) {
    if (!PHONE_PATTERN.test(body.phone.trim())) {
      return NextResponse.json({ error: "Numéro de téléphone invalide" }, { status: 400 });
    }
    phone = body.phone.trim();
    const { error: updateError } = await supabase
      .from("orders")
      .update({ customer_phone: phone })
      .eq("id", id);
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
  }

  const trackingUrl = `${request.nextUrl.origin}/commande/suivi/${id}`;
  const notification = await sendTrackingLink({
    firstName: order.customer_name.trim().split(" ")[0],
    phone,
    email: order.customer_email,
    trackingUrl,
  });

  await supabase
    .from("orders")
    .update({
      notification_channel: notification.channel,
      notification_error: notification.error ?? null,
    })
    .eq("id", id);

  return NextResponse.json({ channel: notification.channel });
}
