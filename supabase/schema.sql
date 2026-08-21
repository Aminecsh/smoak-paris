-- Smoak Paris — Lot 2 : commande réelle
-- À exécuter dans Supabase → SQL Editor.

create extension if not exists pgcrypto;

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity,
  created_at timestamptz not null default now(),
  customer_name text not null,
  customer_phone text not null,
  delivery_address text not null,
  delivery_note text,
  payment_method text not null default 'a_la_livraison',
  status text not null default 'recue',
  total_price numeric(10, 2) not null
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  kind text not null check (kind in ('produit', 'chicha')),
  name text not null,
  unit_price numeric(10, 2) not null,
  quantity integer not null,
  details jsonb
);

-- RLS activée sans policy : seule la clé service_role (utilisée par l'API
-- serveur Next.js) peut lire/écrire. Aucun accès direct depuis le client.
alter table orders enable row level security;
alter table order_items enable row level security;
