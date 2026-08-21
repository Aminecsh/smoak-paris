import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidStockSession, STOCK_COOKIE_NAME } from "@/lib/stockAuth";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get(STOCK_COOKIE_NAME)?.value;
  if (!isValidStockSession(session)) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id, quantity } = await request.json().catch(() => ({}));
  if (typeof id !== "string" || !Number.isInteger(quantity) || quantity < 0) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("stock_items")
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, name, category, quantity")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Référence introuvable" },
      { status: 404 },
    );
  }

  return NextResponse.json({ item: data });
}
