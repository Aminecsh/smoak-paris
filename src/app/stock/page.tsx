import { cookies } from "next/headers";
import { isValidStockSession, STOCK_COOKIE_NAME } from "@/lib/stockAuth";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import StockLogin from "@/components/StockLogin";
import StockDashboard, { StockItem } from "@/components/StockDashboard";

export default async function StockPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(STOCK_COOKIE_NAME)?.value;

  if (!isValidStockSession(session)) {
    return <StockLogin />;
  }

  const supabase = getSupabaseServerClient();
  const { data: items } = await supabase
    .from("stock_items")
    .select("id, name, category, quantity")
    .order("category")
    .order("name")
    .returns<StockItem[]>();

  return <StockDashboard items={items ?? []} />;
}
