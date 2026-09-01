import type { EventItem } from '@/data/mockEvents';
import { formatCardDate, formatDoorTime, formatFullDate, weekdayLabel } from './dates.ts';
import { cleanEventTitle, displayVenueName, htmlToPlainText } from './html.ts';
import { isKonstanzEvent, venueOf } from './isKonstanzEvent.ts';
import type { TribeEvent, TribeImage } from './types';

function pad2(value: string | number | undefined, fallback = '00'): string {
  const raw = String(value ?? '').trim();
  if (!raw) return fallback;
  return raw.padStart(2, '0');
}

function absoluteUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('http://')) return `https://${url.slice('http://'.length)}`;
  return url;
}

export function imageCandidates(image: TribeImage | false | null | undefined): string[] {
  if (!image || typeof image !== 'object') return [];
  const sizes = image.sizes ?? {};
  const ordered = [
    image.url,
    sizes.large?.url,
    sizes.medium_large?.url,
    sizes.medium?.url,
    sizes['neve-blog']?.url,
    sizes.thumbnail?.url,
  ];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of ordered) {
    const url = absoluteUrl(raw);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push(url);
  }
  return out;
}

function startYmd(event: TribeEvent): string | undefined {
  const details = event.start_date_details;
  if (details?.year && details.month && details.day) {
    return `${details.year}-${pad2(details.month, '01')}-${pad2(details.day, '01')}`;
  }
  const raw = event.start_date?.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(raw ?? '') ? raw : undefined;
}

export function mapTribeEvent(event: TribeEvent): EventItem | null {
  if (!isKonstanzEvent(event)) return null;
  const venue = venueOf(event);
  const ymd = startYmd(event);
  if (!ymd) return null;

  const hour = pad2(event.start_date_details?.hour ?? event.start_date?.slice(11, 13), '00');
  const minutes = pad2(event.start_date_details?.minutes ?? event.start_date?.slice(14, 16), '00');
  const time = formatDoorTime(hour, minutes);
  const cost = (event.cost ?? '').trim();
  const venueName = venue?.venue?.trim() || 'Konstanz';
  const title = cleanEventTitle(event.title ?? '', venueName);
  const category = event.categories?.[0]?.name?.trim() || displayVenueName(venueName);
  const tz = event.timezone || 'Europe/Zurich';
  const photos = [...imageCandidates(event.image), ...imageCandidates(venue?.image)];

  return {
    id: String(event.id),
    title,
    venue: displayVenueName(venueName),
    city: 'Konstanz',
    date: formatCardDate(ymd, time, tz),
    time,
    fullDate: formatFullDate(ymd, tz),
    price: cost || '',
    isFree: cost ? /free|gratis|frei/i.test(cost) : undefined,
    category: displayVenueName(category),
    tags: [],
    image: photos[0] ?? '',
    description: htmlToPlainText(event.description ?? ''),
    isFeatured: Boolean(event.featured),
    dayOfWeek: weekdayLabel(ymd),
    sourceUrl: event.url || undefined,
    website: event.website?.trim() || undefined,
    venueAddress: venue?.address?.trim() || undefined,
    venueZip: venue?.zip?.trim() || undefined,
    startDate: ymd,
  };
}
