import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidStockSession, STOCK_COOKIE_NAME } from "@/lib/stockAuth";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

interface PushSubscriptionJSON {
  endpoint: string;
  keys?: { p256dh?: string; auth?: string };
}

// Enregistre l'abonnement aux notifications push d'un appareil de l'équipe
// — réservé à ceux qui ont accès à la gestion des commandes.
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  if (!isValidStockSession(cookieStore.get(STOCK_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body: PushSubscriptionJSON = await request.json().catch(() => ({}));
  if (!body.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
    return NextResponse.json({ error: "Abonnement invalide" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      endpoint: body.endpoint,
      p256dh: body.keys.p256dh,
      auth: body.keys.auth,
    },
    { onConflict: "endpoint" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
