import type { EventItem } from '../../data/mockEvents.ts';
import { addDaysYmd, localYmd } from '../partyInsider/dates.ts';
import { apiGet } from './client.ts';
import { CACHE_TTL_MS, EVENTS_PER_PAGE, LISTING_DAYS, MAX_PAGES } from './config.ts';
import { mapApiEvent } from './mapEvent.ts';
import type { ApiEvent, EventListResponse } from './types.ts';

type ListEventsParams = {
  city?: string;
  status?: 'current' | 'upcoming' | 'all';
  fromDate?: string;
  toDate?: string;
  partyOnly?: boolean;
  page?: number;
  perPage?: number;
};

let memoryCache: { at: number; from: string; events: EventItem[] } | null = null;
let inflight: Promise<EventItem[]> | null = null;

function sortKey(event: EventItem): string {
  return `${event.startDate ?? ''}T${event.time}`;
}

function dedupeEvents(events: EventItem[]): EventItem[] {
  const byId = new Map<string, EventItem>();
  for (const event of events) {
    if (!byId.has(event.id)) byId.set(event.id, event);
  }
  return [...byId.values()].sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
}

export async function listEvents(params: ListEventsParams = {}): Promise<EventListResponse> {
  return apiGet<EventListResponse>('/api/events', {
    city: params.city ?? 'Konstanz',
    status: params.status ?? 'all',
    party_only: params.partyOnly ?? false,
    from_date: params.fromDate,
    to_date: params.toDate,
    page: params.page ?? 1,
    per_page: params.perPage ?? EVENTS_PER_PAGE,
  });
}

async function collectEvents(fromDate: string, toDate: string): Promise<ApiEvent[]> {
  const collected: ApiEvent[] = [];
  let page = 1;
  let hasNext = true;

  while (hasNext && page <= MAX_PAGES) {
    const data = await listEvents({
      city: 'Konstanz',
      status: 'all',
      partyOnly: false,
      fromDate,
      toDate,
      page,
      perPage: EVENTS_PER_PAGE,
    });
    collected.push(...(data.items ?? []));
    hasNext = Boolean(data.has_next);
    page += 1;
  }

  return collected;
}

export async function fetchKonstanzEvents(options?: {
  bypassCache?: boolean;
  now?: Date;
}): Promise<EventItem[]> {
  const now = options?.now ?? new Date();
  const from = localYmd(now);
  if (!options?.bypassCache && memoryCache && memoryCache.from === from && Date.now() - memoryCache.at < CACHE_TTL_MS) {
    return memoryCache.events;
  }
  if (inflight) return inflight;

  inflight = (async () => {
    const fromDate = `${from}T00:00:00`;
    const toDate = `${addDaysYmd(from, LISTING_DAYS)}T23:59:59`;
    const raw = await collectEvents(fromDate, toDate);
    const events = dedupeEvents(raw.map(mapApiEvent).filter((event): event is EventItem => event !== null));
    memoryCache = { at: Date.now(), from, events };
    return events;
  })().finally(() => {
    inflight = null;
  });

  return inflight;
}

export function clearEventsCache(): void {
  memoryCache = null;
  inflight = null;
}
