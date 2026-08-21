import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { isValidStockSession, STOCK_COOKIE_NAME } from "@/lib/stockAuth";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import StockLogin from "@/components/StockLogin";
import LivreurControls from "@/components/LivreurControls";

interface OrderItemRow {
  id: string;
  name: string;
  quantity: number;
}

interface OrderRow {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_note: string | null;
  total_price: number;
  status: string;
  payment_method: string;
}

const PAYMENT_LABELS: Record<string, string> = {
  cb: "Carte bancaire",
  especes: "Espèces",
};

export default async function LivreurOrderPage(
  props: PageProps<"/livreur/[id]">,
) {
  const cookieStore = await cookies();
  if (!isValidStockSession(cookieStore.get(STOCK_COOKIE_NAME)?.value)) {
    return <StockLogin />;
  }

  const { id } = await props.params;
  const supabase = getSupabaseServerClient();

  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, order_number, customer_name, customer_phone, delivery_address, delivery_note, total_price, status, payment_method",
    )
    .eq("id", id)
    .single<OrderRow>();

  if (!order) {
    notFound();
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("id, name, quantity")
    .eq("order_id", id)
    .returns<OrderItemRow[]>();

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-serif text-2xl font-semibold text-brand">
        Commande n° {order.order_number}
      </h1>

      <div className="mt-4 rounded-xl border border-brand/10 bg-cream p-5">
        <p className="text-sm font-medium text-brand">{order.customer_name}</p>
        <p className="text-sm text-brand/70">{order.customer_phone}</p>
        <p className="text-sm text-brand/70">{order.delivery_address}</p>
        {order.delivery_note && (
          <p className="mt-2 text-xs text-brand/50">Note : {order.delivery_note}</p>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-brand/10 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-brand/50">
          Contenu
        </h2>
        <ul className="mt-3 flex flex-col gap-1.5 text-sm text-brand/70">
          {(items ?? []).map((item) => (
            <li key={item.id}>
              {item.quantity} × {item.name}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between border-t border-brand/10 pt-3">
          <span className="text-sm font-medium text-brand/70">Total</span>
          <span className="font-mono text-lg font-bold text-brand">
            {order.total_price.toFixed(2)} €
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-medium text-brand/70">Paiement</span>
          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
            {PAYMENT_LABELS[order.payment_method] ?? order.payment_method}
          </span>
        </div>
      </div>

      <LivreurControls orderId={order.id} initialStatus={order.status} />
    </main>
  );
}
