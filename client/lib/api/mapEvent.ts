import type { EventItem } from '../../data/mockEvents.ts';
import { formatCardDate, formatFullDate, weekdayLabel } from '../partyInsider/dates.ts';
import { cleanEventTitle, displayVenueName } from '../partyInsider/html.ts';
import type { ApiEvent } from './types.ts';

const TZ = 'Europe/Zurich';

function pad2(value: string | number | undefined, fallback = '00'): string {
  const raw = String(value ?? '').trim();
  if (!raw) return fallback;
  return raw.padStart(2, '0');
}

function absoluteUrl(url: string | undefined | null): string {
  if (!url) return '';
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('http://')) return `https://${url.slice('http://'.length)}`;
  return url;
}

export function startParts(
  iso: string | null | undefined,
  timeZone = TZ,
): { ymd: string; time: string } | null {
  if (!iso?.trim()) return null;
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return null;

  const ymd = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dt);

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    hourCycle: 'h23',
  }).formatToParts(dt);
  const hour = pad2(parts.find((part) => part.type === 'hour')?.value, '00');
  const minutes = pad2(parts.find((part) => part.type === 'minute')?.value, '00');
  return { ymd, time: `${hour}:${minutes}` };
}

function coord(value: number | string | null | undefined): number | undefined {
  if (value == null || value === '') return undefined;
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n) || n === 0) return undefined;
  return n;
}

export function mapApiEvent(event: ApiEvent): EventItem | null {
  const start = startParts(event.start_date, event.timezone || TZ);
  if (!start) return null;

  const venueName = event.venue?.name?.trim() || 'Konstanz';
  const title = cleanEventTitle(event.title ?? '', venueName);
  const categoryRaw = event.categories?.[0]?.name?.trim() || displayVenueName(venueName);
  const cost = (event.cost ?? '').trim();
  const tags = (event.tags ?? []).map((tag) => tag.name.trim()).filter(Boolean);

  return {
    id: String(event.id),
    title,
    venue: displayVenueName(venueName),
    city: event.venue?.city?.trim() || 'Konstanz',
    date: formatCardDate(start.ymd, start.time, event.timezone || TZ),
    time: start.time,
    fullDate: formatFullDate(start.ymd, event.timezone || TZ),
    price: cost,
    isFree: cost ? /free|gratis|frei/i.test(cost) : undefined,
    category: displayVenueName(categoryRaw),
    tags,
    image: absoluteUrl(event.image),
    description: event.description ?? '',
    isFeatured: Boolean(event.featured),
    dayOfWeek: weekdayLabel(start.ymd),
    venueId: event.venue?.id,
    lat: coord(event.venue?.latitude),
    lng: coord(event.venue?.longitude),
    sourceUrl: event.url || undefined,
    website: event.website?.trim() || event.venue?.website?.trim() || undefined,
    venueAddress: event.venue?.address?.trim() || undefined,
    venueZip: event.venue?.zip?.trim() || undefined,
    startDate: start.ymd,
    isParty: event.is_party,
    partyScore: event.party_score,
    status: event.status,
  };
}
