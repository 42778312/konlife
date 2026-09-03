import type { EventItem } from '../../data/mockEvents.ts';
import type { RidePlaceDto } from '../api/taxi.ts';

export function venuePlaces(events: EventItem[], query: string): RidePlaceDto[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const seen = new Set<string>();
  const out: RidePlaceDto[] = [];
  for (const event of events) {
    const lat = Number(event.lat);
    const lng = Number(event.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat === 0 || lng === 0) continue;
    const name = event.venue.trim();
    if (!name.toLowerCase().includes(q)) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      id: `venue:${event.venueId ?? name}`,
      label: name,
      detail: event.venueAddress?.trim() || 'Tonight’s venue',
      lat,
      lng,
    });
  }
  return out.slice(0, 5);
}

export function mergePlaces(venues: RidePlaceDto[], remote: RidePlaceDto[]): RidePlaceDto[] {
  const seen = new Set(venues.map((place) => `${place.lat.toFixed(4)}|${place.lng.toFixed(4)}`));
  const merged = [...venues];
  for (const item of remote) {
    const key = `${item.lat.toFixed(4)}|${item.lng.toFixed(4)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }
  return merged.slice(0, 8);
}
