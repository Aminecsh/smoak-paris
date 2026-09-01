import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidStockSession, STOCK_COOKIE_NAME } from "@/lib/stockAuth";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { isOrderStatus } from "@/lib/orderStatus";

export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/commandes/[id]/status">,
) {
  const cookieStore = await cookies();
  if (!isValidStockSession(cookieStore.get(STOCK_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const { status } = await request.json().catch(() => ({}));
  if (!isOrderStatus(status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
