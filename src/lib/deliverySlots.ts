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

// Minutes continues sur la "nuit de service" : 22h-23h30 gardent leur valeur,
// 00h-01h30 (après minuit) sont décalées de +24h pour rester croissantes par
// rapport à la veille au soir.
function toContinuousMinutes(hour: number, minute: number): number {
  const mins = hour * 60 + minute;
  return hour < 12 ? mins + 24 * 60 : mins;
}

function fromContinuousMinutes(continuous: number): string {
  const mins = continuous % (24 * 60);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function slotToContinuousMinutes(slot: string): number {
  const [h, m] = slot.split(":").map(Number);
  return toContinuousMinutes(h, m);
}

function nowContinuousMinutes(): number {
  const now = new Date();
  return toContinuousMinutes(now.getHours(), now.getMinutes());
}

// Créneaux de 30 min disponibles pour une reprise anticipée : de maintenant
// (arrondi au prochain quart d'heure) jusqu'à l'heure limite (exclue, déjà
// couverte par défaut).
export function getEarlyReturnSlots(deliverySlot: string): string[] {
  const deadline = slotToContinuousMinutes(deliverySlot) + RETURN_DELAY_MINUTES;
  const start = Math.ceil(nowContinuousMinutes() / 30) * 30;

  const slots: string[] = [];
  for (let t = start; t < deadline; t += 30) {
    slots.push(fromContinuousMinutes(t));
  }
  return slots;
}

// Au-delà de 21h (et jusqu'au petit matin), on ne réserve plus un créneau
// pour la soirée : la commande est "spontanée", livrée ~45 min après
// l'achat. Avant 21h, on choisit un créneau parmi DELIVERY_SLOTS.
export const SPONTANEOUS_DELIVERY_MINUTES = 45;

export function isSlotOrderingOpen(now: Date = new Date()): boolean {
  return now.getHours() < 21;
}

// Calcule l'heure de livraison estimée d'une commande spontanée, au format
// "HH:MM" — même format que les créneaux classiques, pour rester compatible
// avec le reste du système (heure de restitution, reprise anticipée...).
export function getSpontaneousDeliverySlot(now: Date = new Date()): string {
  const total = (now.getHours() * 60 + now.getMinutes() + SPONTANEOUS_DELIVERY_MINUTES) % (24 * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
