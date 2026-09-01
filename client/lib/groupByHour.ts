import type { EventItem } from '@/data/mockEvents';

export function hourKey(time: string): string {
  const [h] = time.split(':');
  const hour = Number.parseInt(h ?? '0', 10);
  return `${String(Number.isFinite(hour) ? hour : 0).padStart(2, '0')}:00`;
}

export function groupByHour(events: EventItem[]): { hour: string; events: EventItem[] }[] {
  const map = new Map<string, EventItem[]>();
  for (const event of events) {
    const key = hourKey(event.time);
    const list = map.get(key);
    if (list) list.push(event);
    else map.set(key, [event]);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([hour, grouped]) => ({
      hour,
      events: grouped.sort((a, b) => a.time.localeCompare(b.time)),
    }));
}

export function mastheadDate(d = new Date()): string {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'] as const;
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}
