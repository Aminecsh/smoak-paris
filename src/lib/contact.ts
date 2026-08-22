import type { DeliveryZone } from "./deliveryZones";

// Numéro provisoire du service — sera remplacé par le vrai numéro plus tard.
export const SERVICE_PHONE_NUMBER = "0600000000";
export const SERVICE_PHONE_DISPLAY = "06 00 00 00 00";
export const SERVICE_WHATSAPP_NUMBER = `33${SERVICE_PHONE_NUMBER.slice(1)}`;

// Numéros provisoires des 2 livreurs par secteur — à personnaliser quand
// chaque livreur aura son propre numéro.
export const DRIVER_PHONE_NUMBERS: Record<DeliveryZone, string> = {
  sud_est: "0600000000",
  nord_ouest: "0600000000",
};

export const DRIVER_PHONE_DISPLAYS: Record<DeliveryZone, string> = {
  sud_est: "06 00 00 00 00",
  nord_ouest: "06 00 00 00 00",
};
