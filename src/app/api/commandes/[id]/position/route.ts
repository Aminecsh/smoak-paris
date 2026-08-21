import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidStockSession, STOCK_COOKIE_NAME } from "@/lib/stockAuth";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/commandes/[id]/position">,
) {
  const cookieStore = await cookies();
  if (!isValidStockSession(cookieStore.get(STOCK_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const { lat, lng } = await request.json().catch(() => ({}));
  if (typeof lat !== "number" || typeof lng !== "number") {
    return NextResponse.json({ error: "Coordonnées invalides" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("orders")
    .update({ driver_lat: lat, driver_lng: lng, driver_updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
