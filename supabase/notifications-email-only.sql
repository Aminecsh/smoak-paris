-- Smoak Paris — retire WhatsApp du canal de notification (email uniquement).
-- À exécuter dans Supabase → SQL Editor.

alter table orders drop constraint if exists orders_notification_channel_check;
alter table orders add constraint orders_notification_channel_check
  check (notification_channel in ('email', 'failed'));
