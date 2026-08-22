-- Smoak Paris — créneaux de livraison (toutes les 30 min, 22h-1h30)
-- À exécuter dans Supabase → SQL Editor.

alter table orders add column if not exists delivery_slot text;

-- Remplace create_order (11 arguments) par une version à 12 arguments qui
-- enregistre aussi le créneau de livraison choisi.
drop function if exists create_order(
  text, text, text, text, numeric, jsonb, jsonb, double precision, double precision, text, text
);

create or replace function create_order(
  p_customer_name text,
  p_customer_phone text,
  p_delivery_address text,
  p_delivery_note text,
  p_total_price numeric,
  p_order_items jsonb,
  p_stock_decrements jsonb,
  p_delivery_lat double precision default null,
  p_delivery_lng double precision default null,
  p_customer_email text default null,
  p_payment_method text default 'especes',
  p_delivery_slot text default null
) returns table(id uuid, order_number bigint)
language plpgsql
as $$
declare
  v_order_id uuid;
  v_order_number bigint;
  item jsonb;
  dec jsonb;
  v_rows_updated int;
begin
  insert into orders (
    customer_name, customer_phone, customer_email, delivery_address, delivery_note,
    total_price, delivery_lat, delivery_lng, payment_method, delivery_slot
  )
  values (
    p_customer_name, p_customer_phone, p_customer_email, p_delivery_address, p_delivery_note,
    p_total_price, p_delivery_lat, p_delivery_lng, p_payment_method, p_delivery_slot
  )
  returning orders.id, orders.order_number into v_order_id, v_order_number;

  for item in select * from jsonb_array_elements(p_order_items)
  loop
    insert into order_items (order_id, kind, name, unit_price, quantity, details)
    values (
      v_order_id, item->>'kind', item->>'name',
      (item->>'unit_price')::numeric, (item->>'quantity')::int, item->'details'
    );
  end loop;

  for dec in select * from jsonb_array_elements(p_stock_decrements)
  loop
    update stock_items
    set quantity = quantity - (dec->>'quantity')::int, updated_at = now()
    where stock_items.id = dec->>'id' and quantity >= (dec->>'quantity')::int;

    get diagnostics v_rows_updated = row_count;
    if v_rows_updated = 0 then
      raise exception 'Stock insuffisant pour %', coalesce(dec->>'name', dec->>'id');
    end if;
  end loop;

  return query select v_order_id, v_order_number;
end;
$$;

grant execute on function create_order to service_role, anon, authenticated;

NOTIFY pgrst, 'reload schema';
