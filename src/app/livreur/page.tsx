import Link from "next/link";
import { cookies } from "next/headers";
import { isValidStockSession, STOCK_COOKIE_NAME } from "@/lib/stockAuth";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import StockLogin from "@/components/StockLogin";
import { formatOrderReference } from "@/lib/orderNumber";
import PushSubscribeButton from "@/components/PushSubscribeButton";

const STATUS_LABELS: Record<string, string> = {
  recue: "Reçue",
  en_preparation: "En préparation",
  en_livraison: "En livraison",
  livree: "Livrée",
};

interface OrderRow {
  id: string;
  order_number: number;
  customer_name: string;
  delivery_address: string;
  status: string;
  total_price: number;
}

export default async function LivreurPage() {
  const cookieStore = await cookies();
  if (!isValidStockSession(cookieStore.get(STOCK_COOKIE_NAME)?.value)) {
    return <StockLogin />;
  }

  const supabase = getSupabaseServerClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, customer_name, delivery_address, status, total_price")
    .neq("status", "livree")
    .order("created_at", { ascending: true })
    .returns<OrderRow[]>();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-brand">
        Commandes en cours
      </h1>
      <p className="mt-1 text-sm text-brand/60">
        {orders?.length ?? 0} commande(s) à traiter.
      </p>

      <div className="mt-4">
        <PushSubscribeButton />
      </div>

      <ul className="mt-2 flex flex-col gap-3">
        {(orders ?? []).map((order) => (
          <li key={order.id}>
            <Link
              href={`/livreur/${order.id}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-brand/10 bg-cream p-4 hover:border-brand/30"
            >
              <div className="min-w-0">
                <p className="font-serif font-semibold text-brand">
                  Commande n° {formatOrderReference(order.order_number)} —{" "}
                  {order.customer_name}
                </p>
                <p className="truncate text-sm text-brand/60">
                  {order.delivery_address}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <span className="block rounded-full bg-brand/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand">
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
                <span className="mt-1 block font-mono text-sm text-brand">
                  {order.total_price.toFixed(2)} €
                </span>
              </div>
            </Link>
          </li>
        ))}
        {(orders ?? []).length === 0 && (
          <p className="text-sm text-brand/50">Aucune commande en cours.</p>
        )}
      </ul>
    </main>
  );
}
