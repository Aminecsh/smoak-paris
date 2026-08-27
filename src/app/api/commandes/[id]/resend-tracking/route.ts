import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { sendTrackingLink } from "@/lib/notifications/sendTrackingLink";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Permet au client de corriger son email (si le lien de suivi n'a pas pu
// être envoyé) et de le renvoyer.
export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/commandes/[id]/resend-tracking">,
) {
  const { id } = await ctx.params;

  let body: { email?: string };
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

  let email = order.customer_email;
  if (body.email) {
    if (!EMAIL_PATTERN.test(body.email.trim())) {
      return NextResponse.json({ error: "Adresse email invalide" }, { status: 400 });
    }
    email = body.email.trim();
    const { error: updateError } = await supabase
      .from("orders")
      .update({ customer_email: email })
      .eq("id", id);
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
  }

  const trackingUrl = `${request.nextUrl.origin}/commande/suivi/${id}`;
  const notification = await sendTrackingLink({
    firstName: order.customer_name.trim().split(" ")[0],
    phone: order.customer_phone,
    email,
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
