-- Smoak Paris — abonnements aux notifications push (nouvelle commande),
-- pour alerter en temps réel sur le téléphone comme sur Shopify.
-- À exécuter dans Supabase → SQL Editor.

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  endpoint text not null unique,
  p256dh text not null,
  auth text not null
);

alter table push_subscriptions enable row level security;

grant all on push_subscriptions to service_role;
