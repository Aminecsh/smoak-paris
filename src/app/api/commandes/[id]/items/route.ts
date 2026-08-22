import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { buildOrder, type OrderItemInput } from "@/lib/orderBuilder";

// Ajoute des articles à une commande déjà passée — uniquement tant qu'elle
// est au statut "recue" (vérifié côté base, verrouillé pour éviter une
// course avec le livreur qui passerait la commande en préparation). Le
// supplément est ajouté au total, réglé à la livraison comme le reste.
export async function POST(
  request: Request,
  ctx: RouteContext<"/api/commandes/[id]/items">,
) {
  const { id } = await ctx.params;

  let body: { items?: OrderItemInput[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const built = buildOrder({ items: body.items ?? [], configuredChichas: [] });
  if ("error" in built) {
    return NextResponse.json({ error: built.error }, { status: 400 });
  }
  const { itemRows, stockDecrements } = built;
  const additionalPrice = itemRows.reduce(
    (sum, row) => sum + row.unit_price * row.quantity,
    0,
  );

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.rpc("add_order_items", {
    p_order_id: id,
    p_order_items: itemRows,
    p_stock_decrements: stockDecrements,
    p_additional_price: additionalPrice,
  });

  if (error) {
    const isStockError = error.message?.includes("Stock insuffisant");
    const isLocked = error.message?.includes("ne peut plus être modifiée");
    const isNotFound = error.message?.includes("introuvable");
    return NextResponse.json(
      { error: error.message },
      { status: isStockError ? 409 : isLocked ? 409 : isNotFound ? 404 : 500 },
    );
  }

  return NextResponse.json({ newTotal: data, addedTotal: additionalPrice });
}
