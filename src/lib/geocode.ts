export interface GeoPoint {
  lat: number;
  lng: number;
}

// Géocodage via Nominatim (OpenStreetMap) — gratuit, pas de clé API.
// Best-effort : en cas d'échec ou de timeout, la commande est quand même
// créée sans coordonnées (pas de pin de destination sur la carte de suivi).
export async function geocodeAddress(address: string): Promise<GeoPoint | null> {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", address);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");
    url.searchParams.set("countrycodes", "fr");

    const res = await fetch(url, {
      headers: { "User-Agent": "smoak-paris/1.0 (commande en ligne)" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;

    const results: Array<{ lat: string; lon: string }> = await res.json();
    const first = results[0];
    if (!first) return null;

    return { lat: parseFloat(first.lat), lng: parseFloat(first.lon) };
  } catch {
    return null;
  }
}
