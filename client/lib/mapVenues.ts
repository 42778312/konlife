import type { EventItem } from '../data/mockEvents.ts';

export type VenuePin = {
  id: string;
  venue: string;
  lat: number;
  lng: number;
  events: EventItem[];
};

export type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export const KONSTANZ_CENTER = { latitude: 47.6602, longitude: 9.1758 };

export const KONSTANZ_REGION: MapRegion = {
  ...KONSTANZ_CENTER,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

export function hasCoords(event: EventItem): event is EventItem & { lat: number; lng: number } {
  return Number.isFinite(event.lat) && Number.isFinite(event.lng);
}

export function groupEventsByVenue(events: EventItem[]): VenuePin[] {
  const grouped = new Map<string, VenuePin>();
  for (const event of events) {
    if (!hasCoords(event)) continue;
    const id = `${event.venue}|${event.lat.toFixed(5)}|${event.lng.toFixed(5)}`;
    const existing = grouped.get(id);
    if (existing) {
      existing.events.push(event);
    } else {
      grouped.set(id, {
        id,
        venue: event.venue,
        lat: event.lat,
        lng: event.lng,
        events: [event],
      });
    }
  }
  return [...grouped.values()];
}

export function regionForPins(pins: VenuePin[]): MapRegion {
  if (pins.length === 0) return KONSTANZ_REGION;
  if (pins.length === 1) {
    return {
      latitude: pins[0].lat,
      longitude: pins[0].lng,
      latitudeDelta: 0.012,
      longitudeDelta: 0.012,
    };
  }

  const lats = pins.map((pin) => pin.lat);
  const lngs = pins.map((pin) => pin.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * 1.7, 0.012),
    longitudeDelta: Math.max((maxLng - minLng) * 1.7, 0.012),
  };
}
