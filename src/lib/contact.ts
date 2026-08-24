import type { DeliveryZone } from "./deliveryZones";

export const SERVICE_PHONE_NUMBER = "0756902613";
export const SERVICE_PHONE_DISPLAY = "07 56 90 26 13";
export const SERVICE_WHATSAPP_NUMBER = `33${SERVICE_PHONE_NUMBER.slice(1)}`;

// Numéros des 2 livreurs par secteur — à personnaliser quand chaque livreur
// aura son propre numéro.
export const DRIVER_PHONE_NUMBERS: Record<DeliveryZone, string> = {
  sud_est: "0756902613",
  nord_ouest: "0756902613",
};

export const DRIVER_PHONE_DISPLAYS: Record<DeliveryZone, string> = {
  sud_est: "07 56 90 26 13",
  nord_ouest: "07 56 90 26 13",
};
