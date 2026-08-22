-- Smoak Paris — ajout d'articles à une commande "reçue" + reprise anticipée
-- de la chicha. À exécuter dans Supabase → SQL Editor.

alter table orders add column if not exists early_return_slot text;

-- Ajoute des articles à une commande existante tant qu'elle est encore au
-- statut "recue" (verrou de ligne pour éviter une course avec un changement
-- de statut concurrent), décrémente le stock et augmente le total.
create or replace function add_order_items(
  p_order_id uuid,
  p_order_items jsonb,
  p_stock_decrements jsonb,
  p_additional_price numeric
) returns numeric
language plpgsql
as $$
declare
  v_status text;
  item jsonb;
  dec jsonb;
  v_rows_updated int;
  v_new_total numeric;
begin
  select status into v_status from orders where id = p_order_id for update;
  if v_status is null then
    raise exception 'Commande introuvable';
  end if;
  if v_status <> 'recue' then
    raise exception 'La commande ne peut plus être modifiée';
  end if;

  for item in select * from jsonb_array_elements(p_order_items)
  loop
    insert into order_items (order_id, kind, name, unit_price, quantity, details)
    values (
      p_order_id, item->>'kind', item->>'name',
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

  update orders set total_price = total_price + p_additional_price
  where id = p_order_id
  returning total_price into v_new_total;

  return v_new_total;
end;
$$;

grant execute on function add_order_items to service_role, anon, authenticated;

NOTIFY pgrst, 'reload schema';
