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

// Toute la logique de créneaux raisonne en heure de Paris, jamais l'heure
// locale du runtime qui exécute le code : en production (Vercel), les
// fonctions serverless tournent en UTC, alors que le client (navigateur du
// visiteur) raisonne en heure de Paris — sans ça, le serveur et le client se
// contredisent sur l'heure pendant tout le décalage été/hiver (jusqu'à 2h),
// avec des commandes rejetées à tort ("Créneau de livraison invalide").
const PARIS_TIME_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Paris",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function parisTimeParts(now: Date): { hour: number; minute: number } {
  const parts = PARIS_TIME_FORMATTER.formatToParts(now);
  const hour = Number(parts.find((p) => p.type === "hour")!.value);
  const minute = Number(parts.find((p) => p.type === "minute")!.value);
  return { hour, minute };
}

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
  const { hour, minute } = parisTimeParts(new Date());
  return toContinuousMinutes(hour, minute);
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

// Avant 21h (heure de Paris), on peut réserver un créneau précis parmi
// DELIVERY_SLOTS pour la soirée. Passé 21h, réserver un créneau n'a plus de
// sens (il serait déjà écoulé ou imminent) : seule la livraison immédiate
// reste proposée.
export function isSlotOrderingOpen(now: Date = new Date()): boolean {
  return parisTimeParts(now).hour < 21;
}

// Livraison "dès que possible" — le client choisit ce mode plutôt qu'un
// créneau précis. Disponible pendant les horaires d'ouverture du service
// (18h à 4h, heure de Paris) ; en dehors, seul un créneau précis reste
// réservable (utile pour précommander l'après-midi pour le soir même).
export const OPENING_HOUR = 18;
export const CLOSING_HOUR = 4;
export const SPONTANEOUS_DELIVERY_MINUTES = 45;

export function isWithinOpeningHours(now: Date = new Date()): boolean {
  const { hour } = parisTimeParts(now);
  return hour >= OPENING_HOUR || hour < CLOSING_HOUR;
}

export const OPENING_HOURS_LABEL = `${OPENING_HOUR}h – ${CLOSING_HOUR}h`;

// Calcule l'heure de livraison estimée d'une commande "dès que possible", au
// format "HH:MM" — même format que les créneaux classiques, pour rester
// compatible avec le reste du système.
export function getSpontaneousDeliverySlot(now: Date = new Date()): string {
  const { hour, minute } = parisTimeParts(now);
  const total = (hour * 60 + minute + SPONTANEOUS_DELIVERY_MINUTES) % (24 * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
