import type { TribeEvent, TribeVenue } from './types';

export const KONSTANZ_CITY = 'Konstanz';

export function venueOf(event: TribeEvent): TribeVenue | undefined {
  const venue = event.venue;
  if (!venue) return undefined;
  if (Array.isArray(venue)) return venue[0];
  return venue;
}

/** Hard city gate. Country is ignored — K9 is Konstanz with country Switzerland. */
export function isKonstanzEvent(event: TribeEvent): boolean {
  const city = venueOf(event)?.city?.trim();
  return city === KONSTANZ_CITY;
}
