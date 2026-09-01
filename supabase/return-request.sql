-- Smoak Paris — demande de reprise du matériel par le client, depuis sa
-- page de suivi une fois la commande livrée.
-- À exécuter dans Supabase → SQL Editor.

alter table orders add column if not exists return_requested_at timestamptz;
