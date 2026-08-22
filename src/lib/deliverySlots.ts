// Créneaux de livraison disponibles : toutes les demi-heures de 22h à 1h30.
// La chicha doit être restituée 2h après le créneau choisi (dernière reprise
// à 3h30 pour le dernier créneau de 1h30).
export const RETURN_DELAY_MINUTES = 2 * 60;

export const DELIVERY_SLOTS = [
  "22:00",
  "22:30",
  "23:00",
  "23:30",
  "00:00",
  "00:30",
  "01:00",
  "01:30",
] as const;

export type DeliverySlot = (typeof DELIVERY_SLOTS)[number];

export function isDeliverySlot(value: unknown): value is DeliverySlot {
  return typeof value === "string" && (DELIVERY_SLOTS as readonly string[]).includes(value);
}

export function formatSlotLabel(slot: string): string {
  const [h, m] = slot.split(":");
  return `${h}h${m}`;
}

export function getReturnTimeLabel(slot: string): string {
  const [h, m] = slot.split(":").map(Number);
  const total = (h * 60 + m + RETURN_DELAY_MINUTES) % (24 * 60);
  const rh = Math.floor(total / 60);
  const rm = total % 60;
  return formatSlotLabel(`${String(rh).padStart(2, "0")}:${String(rm).padStart(2, "0")}`);
}

export const LAST_RETURN_LABEL = getReturnTimeLabel(DELIVERY_SLOTS[DELIVERY_SLOTS.length - 1]);
