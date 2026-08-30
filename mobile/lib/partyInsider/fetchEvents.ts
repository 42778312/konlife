import type { EventItem } from '@/data/mockEvents';
import { addDaysYmd, formatApiDateTime, localYmd } from './dates';
import { isKonstanzEvent } from './isKonstanzEvent';
import { mapTribeEvent } from './mapEvent';
import type { TribeEventsList } from './types';

export const EVENTS_LIST_URL = 'https://www.party-insider.com/wp-json/tribe/events/v1/events/';
export const EVENTS_PER_PAGE = 50;
export const LISTING_DAYS = 56;
const MAX_PAGES = 8;
const CACHE_TTL_MS = 10 * 60 * 1000;

let memoryCache: { at: number; from: string; events: EventItem[] } | null = null;

function listUrl(now = new Date()): string {
  const start = formatApiDateTime(localYmd(now), '00:00:00');
  const end = formatApiDateTime(addDaysYmd(localYmd(now), LISTING_DAYS), '23:59:59');
  const query = new URLSearchParams({
    page: '1',
    per_page: String(EVENTS_PER_PAGE),
    start_date: start,
    end_date: end,
    status: 'publish',
  });
  return `${EVENTS_LIST_URL}?${query.toString()}`;
}

function sortKey(event: EventItem): string {
  return `${event.startDate ?? ''}T${event.time}`;
}

function dedupeEvents(events: EventItem[]): EventItem[] {
  const byId = new Map<string, EventItem>();
  for (const event of events) {
    if (!byId.has(event.id)) byId.set(event.id, event);
  }
  const uniqueDays = new Map<string, EventItem>();
  for (const event of byId.values()) {
    const stamp = `${event.title.toLowerCase()}|${event.venue}|${event.startDate}|${event.time}`;
    const existing = uniqueDays.get(stamp);
    if (!existing || event.id < existing.id) uniqueDays.set(stamp, event);
  }
  return [...uniqueDays.values()].sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
}

async function fetchListPage(url: string): Promise<TribeEventsList> {
  const response = await fetch(url, { credentials: 'omit' });
  if (!response.ok) {
    throw new Error(`Events request failed (${response.status})`);
  }
  return (await response.json()) as TribeEventsList;
}

export async function fetchKonstanzEvents(options?: { bypassCache?: boolean; now?: Date }): Promise<EventItem[]> {
  const now = options?.now ?? new Date();
  const from = localYmd(now);
  if (!options?.bypassCache && memoryCache && memoryCache.from === from && Date.now() - memoryCache.at < CACHE_TTL_MS) {
    return memoryCache.events;
  }

  const collected: EventItem[] = [];
  let url: string | undefined = listUrl(now);
  let pages = 0;

  while (url && pages < MAX_PAGES) {
    const data = await fetchListPage(url);
    for (const raw of data.events ?? []) {
      if (!isKonstanzEvent(raw)) continue;
      const mapped = mapTribeEvent(raw);
      if (mapped) collected.push(mapped);
    }
    url = data.next_rest_url || undefined;
    pages += 1;
  }

  const konstanz = dedupeEvents(collected);
  memoryCache = { at: Date.now(), from, events: konstanz };
  return konstanz;
}

export function clearEventsCache(): void {
  memoryCache = null;
}
