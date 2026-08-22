// Départements d'Île-de-France (préfixe à 2 chiffres du code postal).
export const IDF_DEPARTMENTS = ["75", "77", "78", "91", "92", "93", "94", "95"];

export function isInIleDeFrance(postalCode: string): boolean {
  return IDF_DEPARTMENTS.includes(postalCode.slice(0, 2));
}

export type DeliveryZone = "sud_est" | "nord_ouest";

// Arrondissements parisiens affectés au secteur Sud-Est (le reste de Paris
// va au Nord-Ouest).
const PARIS_SUD_EST_ARRONDISSEMENTS = new Set([
  "75005",
  "75011",
  "75012",
  "75013",
  "75014",
  "75020",
]);

// Départements de grande couronne par secteur.
const SUD_EST_DEPARTMENTS = new Set(["77", "91", "94"]);
const NORD_OUEST_DEPARTMENTS = new Set(["78", "92", "93", "95"]);

// Classe une commande dans un secteur de livraison à partir du code postal.
// Retourne null si le code postal n'est pas en Île-de-France.
export function getDeliveryZone(postalCode: string): DeliveryZone | null {
  if (!isInIleDeFrance(postalCode)) return null;

  const dept = postalCode.slice(0, 2);

  if (dept === "75") {
    return PARIS_SUD_EST_ARRONDISSEMENTS.has(postalCode) ? "sud_est" : "nord_ouest";
  }
  if (SUD_EST_DEPARTMENTS.has(dept)) return "sud_est";
  if (NORD_OUEST_DEPARTMENTS.has(dept)) return "nord_ouest";
  return null;
}

export const DELIVERY_ZONE_LABELS: Record<DeliveryZone, string> = {
  sud_est: "Sud-Est",
  nord_ouest: "Nord-Ouest",
};
