-- Smoak Paris — trace du canal utilisé pour envoyer le lien de suivi
-- (WhatsApp / email / échec) au client. À exécuter dans Supabase → SQL Editor.

alter table orders add column if not exists notification_channel text;
alter table orders add column if not exists notification_error text;

alter table orders drop constraint if exists orders_notification_channel_check;
alter table orders add constraint orders_notification_channel_check
  check (notification_channel in ('whatsapp', 'email', 'failed'));
