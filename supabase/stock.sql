-- Smoak Paris — Gestion des stocks
-- À exécuter dans Supabase → SQL Editor.

create table if not exists stock_items (
  id text primary key,
  name text not null,
  category text not null,
  quantity integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table stock_items enable row level security;

-- Une ligne de stock par référence vendable. Quantité de départ : 50.
insert into stock_items (id, name, category, quantity) values
  ('canette-coca-cola', 'Coca-Cola', 'Boissons', 50),
  ('canette-coca-cherry', 'Coca-Cola Cherry', 'Boissons', 50),
  ('canette-coca-zero', 'Coca-Cola Zero', 'Boissons', 50),
  ('canette-fanta', 'Fanta', 'Boissons', 50),
  ('canette-hawaii', 'Hawaii', 'Boissons', 50),
  ('canette-oasis-cassis', 'Oasis Cassis', 'Boissons', 50),
  ('canette-oasis-fraise', 'Oasis Fraise', 'Boissons', 50),
  ('canette-oasis-pomme-poire', 'Oasis Pomme Poire', 'Boissons', 50),
  ('canette-oasis-tropical', 'Oasis Tropical', 'Boissons', 50),
  ('canette-orangina', 'Orangina', 'Boissons', 50),
  ('canette-schweppes-agrumes', 'Schweppes Agrumes', 'Boissons', 50),
  ('canette-dada-litchi', 'Dada Litchi', 'Boissons', 50),
  ('canette-dada-mangue', 'Dada Mangue', 'Boissons', 50),
  ('canette-dada-melon', 'Dada Melon', 'Boissons', 50),
  ('canette-ice-tea-peche', 'Ice Tea Pêche', 'Boissons', 50),
  ('red-bull', 'Red Bull', 'Boissons', 50),
  ('red-bull-zero', 'Red Bull Zero', 'Boissons', 50),
  ('crazy-tiger', 'Crazy Tiger', 'Boissons', 50),
  ('eau-cristalline-50cl', 'Cristalline 50 cl', 'Boissons', 50),
  ('coca-cola-1-5l', 'Coca-Cola 1,5 L', 'Boissons', 50),
  ('oasis-1-5l', 'Oasis 1,5 L', 'Boissons', 50),
  ('jus-pomme-1l', 'Jus de pomme 1 L', 'Boissons', 50),
  ('bonbons-fini-arc-en-ciel', 'Fini Arc-en-ciel', 'Épicerie sucrée', 50),
  ('bonbons-fini-pasteque', 'Fini Pastèque', 'Épicerie sucrée', 50),
  ('bonbons-fini-peches', 'Fini Pêches', 'Épicerie sucrée', 50),
  ('bonbons-fini-fraise', 'Fini Fraise', 'Épicerie sucrée', 50),
  ('popcorn-caramel', 'Popcorn Caramel', 'Épicerie sucrée', 50),
  ('quasar', 'Chicha Quasar', 'Chicha', 50),
  ('khaloud', 'Chicha Khaloud', 'Chicha', 50),
  ('hawaii', 'Goût Hawaii', 'Chicha', 50),
  ('love-66', 'Goût Love 66', 'Chicha', 50),
  ('mi-amor', 'Goût Mi Amor', 'Chicha', 50),
  ('menthe', 'Goût Menthe', 'Chicha', 50),
  ('recharge', 'Recharge (charbon + briquet + goût)', 'Chicha', 50),
  ('charbon-supplement', 'Charbon en plus', 'Chicha', 50)
on conflict (id) do nothing;

-- Nettoie les anciennes références génériques ou sans photo, remplacées par
-- des déclinaisons précises ci-dessus. Sans effet si elles n'existent pas.
delete from stock_items where id in (
  'canette-oasis', 'canette-dada', 'jus-1-5l',
  'bonbons-traditionnels', 'fils-rouges', 'bonbons-cola', 'chocolat-dubai'
);

-- Crée une commande + ses lignes + décrémente le stock, en une seule
-- transaction atomique : si une référence n'a plus assez de stock, tout
-- est annulé et l'API reçoit une erreur claire.
create or replace function create_order(
  p_customer_name text,
  p_customer_phone text,
  p_delivery_address text,
  p_delivery_note text,
  p_total_price numeric,
  p_order_items jsonb,
  p_stock_decrements jsonb
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
  insert into orders (customer_name, customer_phone, delivery_address, delivery_note, total_price)
  values (p_customer_name, p_customer_phone, p_delivery_address, p_delivery_note, p_total_price)
  returning orders.id, orders.order_number into v_order_id, v_order_number;

  for item in select * from jsonb_array_elements(p_order_items)
  loop
    insert into order_items (order_id, kind, name, unit_price, quantity, details)
    values (
      v_order_id,
      item->>'kind',
      item->>'name',
      (item->>'unit_price')::numeric,
      (item->>'quantity')::int,
      item->'details'
    );
  end loop;

  for dec in select * from jsonb_array_elements(p_stock_decrements)
  loop
    update stock_items
    set quantity = quantity - (dec->>'quantity')::int,
        updated_at = now()
    where stock_items.id = dec->>'id'
      and quantity >= (dec->>'quantity')::int;

    get diagnostics v_rows_updated = row_count;
    if v_rows_updated = 0 then
      raise exception 'Stock insuffisant pour %', coalesce(dec->>'name', dec->>'id');
    end if;
  end loop;

  return query select v_order_id, v_order_number;
end;
$$;

alter table stock_items owner to postgres;
grant all on table stock_items to service_role, anon, authenticated;
grant execute on function create_order to service_role, anon, authenticated;

NOTIFY pgrst, 'reload schema';
