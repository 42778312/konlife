import type { DayKey } from '@/data/mockEvents';

export type PriceFilter = 'all' | 'free' | 'paid';
export type FilterDim = 'when' | 'where' | 'price';

export function isAllVenues(selected: string[], catalog: string[]): boolean {
  return selected.length === 0 || (catalog.length > 0 && selected.length >= catalog.length);
}

export function matchesVenueFilter(eventVenue: string, selected: string[], catalog: string[] = []): boolean {
  if (isAllVenues(selected, catalog)) return true;
  return selected.includes(eventVenue);
}

export function venueFilterLabel(selected: string[], catalog: string[] = []): string {
  if (isAllVenues(selected, catalog)) return 'Where';
  if (selected.length === 1) return selected[0] ?? 'Where';
  return `${selected.length} venues`;
}

export function dayFilterLabel(day: DayKey | 'All'): string {
  return day === 'All' ? 'When' : day;
}

export function priceFilterLabel(price: PriceFilter): string {
  if (price === 'all') return 'Price';
  if (price === 'free') return 'Free';
  return 'Paid';
}

export function toggleVenue(name: string, selected: string[], catalog: string[]): string[] {
  if (isAllVenues(selected, catalog)) return [name];
  const next = selected.includes(name) ? selected.filter((item) => item !== name) : [...selected, name];
  if (next.length === 0 || (catalog.length > 0 && next.length >= catalog.length)) return [];
  return next;
}
