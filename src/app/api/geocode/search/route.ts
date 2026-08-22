import { NextRequest, NextResponse } from "next/server";
import { isInIleDeFrance } from "@/lib/deliveryZones";

interface BanFeature {
  properties: {
    label: string;
    housenumber?: string;
    street?: string;
    name: string;
    postcode: string;
    city: string;
    type: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

interface BanResponse {
  features: BanFeature[];
}

export interface AddressSuggestion {
  streetLine: string;
  postalCode: string;
  city: string;
  lat: number;
  lng: number;
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const url = new URL("https://api-adresse.data.gouv.fr/search/");
    url.searchParams.set("q", q);
    url.searchParams.set("limit", "10");
    url.searchParams.set("type", "housenumber");

    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) {
      return NextResponse.json({ suggestions: [] });
    }

    const data: BanResponse = await res.json();

    const suggestions: AddressSuggestion[] = data.features
      .filter((f) => isInIleDeFrance(f.properties.postcode))
      .map((f) => ({
        streetLine:
          [f.properties.housenumber, f.properties.street].filter(Boolean).join(" ") ||
          f.properties.name,
        postalCode: f.properties.postcode,
        city: f.properties.city,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
      }))
      .slice(0, 5);

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
