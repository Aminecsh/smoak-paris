export interface GeoPoint {
  lat: number;
  lng: number;
}

// Géocodage via la Base Adresse Nationale (data.gouv.fr) — gratuit, pas de
// clé API, adresses françaises fiables. Best-effort : en cas d'échec ou de
// timeout, la commande est quand même créée sans coordonnées (pas de pin de
// destination sur la carte de suivi).
export async function geocodeAddress(address: string): Promise<GeoPoint | null> {
  try {
    const url = new URL("https://api-adresse.data.gouv.fr/search/");
    url.searchParams.set("q", address);
    url.searchParams.set("limit", "1");

    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;

    const data: { features: Array<{ geometry: { coordinates: [number, number] } }> } =
      await res.json();
    const first = data.features[0];
    if (!first) return null;

    return { lat: first.geometry.coordinates[1], lng: first.geometry.coordinates[0] };
  } catch {
    return null;
  }
}
