import { apiGet, ApiError } from './client.ts';

export type RidePlaceDto = {
  id: string;
  label: string;
  detail?: string | null;
  lat: number;
  lng: number;
};

export type TaxiQuote = {
  from_lat: number;
  from_lng: number;
  to_lat: number;
  to_lng: number;
  distance_m: number;
  duration_s: number;
  fare_eur: number;
  tariff: 'day' | 'night';
  tariff_label: string;
  vehicle: 'standard';
  path: [number, number][];
  disclaimer: string;
};

type PlaceListResponse = { items: RidePlaceDto[] };

export async function searchRidePlaces(q: string): Promise<RidePlaceDto[]> {
  const data = await apiGet<PlaceListResponse>('/api/places/search', { q, limit: 8 });
  return data.items ?? [];
}

export async function reverseRidePlace(lat: number, lng: number): Promise<RidePlaceDto | null> {
  try {
    const data = await apiGet<PlaceListResponse>('/api/places/reverse', { lat, lng });
    return data.items?.[0] ?? null;
  } catch (err) {
    if (err instanceof ApiError && err.status === 422) return null;
    throw err;
  }
}

export async function fetchTaxiQuote(from: RidePlaceDto, to: RidePlaceDto): Promise<TaxiQuote> {
  return apiGet<TaxiQuote>('/api/taxi/quote', {
    from_lat: from.lat,
    from_lng: from.lng,
    to_lat: to.lat,
    to_lng: to.lng,
  });
}

export function pathToPoints(path: [number, number][] | undefined): { latitude: number; longitude: number }[] {
  if (!path) return [];
  return path
    .filter((pair) => pair.length >= 2 && Number.isFinite(pair[0]) && Number.isFinite(pair[1]))
    .map(([lng, lat]) => ({ latitude: lat, longitude: lng }));
}
