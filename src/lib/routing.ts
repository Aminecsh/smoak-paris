export interface RouteInfo {
  distanceMeters: number;
  durationSeconds: number;
  geometry: [number, number][];
}

// Itinéraire routier via OSRM (serveur de démo public, gratuit, pas de clé
// API) — cohérent avec le reste du projet qui évite les services payants
// pour l'adresse/la carte (BAN, OpenStreetMap/Leaflet). Best-effort : si le
// service est indisponible, le suivi reste fonctionnel sans distance/ETA.
export async function getDrivingRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): Promise<RouteInfo | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;

    const data: {
      routes?: Array<{
        distance: number;
        duration: number;
        geometry: { coordinates: [number, number][] };
      }>;
    } = await res.json();

    const route = data.routes?.[0];
    if (!route) return null;

    return {
      distanceMeters: route.distance,
      durationSeconds: route.duration,
      geometry: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    };
  } catch {
    return null;
  }
}
