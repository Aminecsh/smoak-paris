-- Smoak Paris — synchronisation des boutons de statut Telegram entre les
-- cofondateurs. Stocke, par commande, l'id du message envoyé à chaque
-- chat_id (ex: {"5083803977": 42, "6889966851": 17}) — permet au webhook
-- d'éditer les 3 messages en même temps quand l'un d'eux clique un bouton.
-- À exécuter dans Supabase → SQL Editor.

alter table orders add column if not exists telegram_message_ids jsonb;
