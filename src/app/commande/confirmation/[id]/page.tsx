import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

interface OrderItemRow {
  id: string;
  name: string;
  unit_price: number;
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
}

export default async function ConfirmationPage(
  props: PageProps<"/commande/confirmation/[id]">,
) {
  const { id } = await props.params;
  const supabase = getSupabaseServerClient();

  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, order_number, customer_name, customer_phone, delivery_address, delivery_note, total_price, status",
    )
    .eq("id", id)
    .single<OrderRow>();

  if (!order) {
    notFound();
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("id, name, unit_price, quantity")
    .eq("order_id", id)
    .returns<OrderItemRow[]>();

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10 sm:px-6">
      <div className="rounded-xl border border-brand/10 bg-cream p-6 text-center">
        <span className="text-3xl">✅</span>
        <h1 className="mt-2 font-serif text-2xl font-semibold text-brand">
          Commande confirmée
        </h1>
        <p className="mt-1 text-sm text-brand/60">
          Commande n° {order.order_number} — paiement à la livraison
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-brand/10 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-brand/50">
          Récapitulatif
        </h2>
        <ul className="mt-3 flex flex-col gap-1.5 text-sm text-brand/70">
          {(items ?? []).map((item) => (
            <li key={item.id} className="flex justify-between gap-2">
              <span className="truncate">
                {item.quantity} × {item.name}
              </span>
              <span className="flex-shrink-0 font-mono">
                {(item.unit_price * item.quantity).toFixed(2)} €
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between border-t border-brand/10 pt-3">
          <span className="text-sm font-medium text-brand/70">Total</span>
          <span className="font-mono text-lg font-bold text-brand">
            {order.total_price.toFixed(2)} €
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-brand/10 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-brand/50">
          Livraison
        </h2>
        <p className="mt-2 text-sm text-brand">{order.customer_name}</p>
        <p className="text-sm text-brand/70">{order.customer_phone}</p>
        <p className="text-sm text-brand/70">{order.delivery_address}</p>
        {order.delivery_note && (
          <p className="mt-2 text-xs text-brand/50">
            Note : {order.delivery_note}
          </p>
        )}
      </div>

      <button
        type="button"
        disabled
        title="Disponible au Lot 3 (suivi GPS)"
        className="mt-6 w-full cursor-not-allowed rounded-full bg-brand/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-brand/40"
      >
        Suivre ma commande — bientôt
      </button>

      <Link
        href="/commande"
        className="mt-3 block text-center text-xs font-medium text-brand/50 hover:text-brand"
      >
        Retour au menu
      </Link>
    </main>
  );
}
