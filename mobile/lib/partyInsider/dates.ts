const TZ = 'Europe/Zurich';

export function addDaysYmd(ymd: string, days: number): string {
  const [year, month, day] = ymd.split('-').map(Number);
  const dt = new Date(Date.UTC(year, (month ?? 1) - 1, (day ?? 1) + days));
  return dt.toISOString().slice(0, 10);
}

export function localYmd(date: Date, timeZone = TZ): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function weekdaySun0(ymd: string): number {
  const [year, month, day] = ymd.split('-').map(Number);
  return new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1)).getUTCDay();
}

export function formatDoorTime(hour: string, minutes: string): string {
  return `${hour.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}

export function formatFullDate(ymd: string, timeZone = TZ): string {
  const [year, month, day] = ymd.split('-').map(Number);
  const utc = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1, 12));
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(utc);
}

export function formatCardDate(ymd: string, time: string, timeZone = TZ): string {
  const [year, month, day] = ymd.split('-').map(Number);
  const utc = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1, 12));
  const weekday = new Intl.DateTimeFormat('en-GB', { timeZone, weekday: 'short' }).format(utc);
  const monthName = new Intl.DateTimeFormat('en-GB', { timeZone, month: 'short' }).format(utc);
  return `${weekday} ${String(day).padStart(2, '0')} ${monthName} · ${time}`;
}

export function dayHeading(ymd: string, now = new Date(), timeZone = TZ): string {
  const today = localYmd(now, timeZone);
  if (ymd === today) return 'Today';
  if (ymd === addDaysYmd(today, 1)) return 'Tomorrow';
  return formatFullDate(ymd, timeZone);
}

export function groupEventsByDate<T extends { startDate?: string; time: string }>(
  events: T[],
  now = new Date(),
): { ymd: string; label: string; items: T[] }[] {
  const groups = new Map<string, T[]>();
  for (const event of events) {
    const ymd = event.startDate;
    if (!ymd) continue;
    const list = groups.get(ymd);
    if (list) list.push(event);
    else groups.set(ymd, [event]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([ymd, items]) => ({
      ymd,
      label: dayHeading(ymd, now),
      items: [...items].sort((a, b) => a.time.localeCompare(b.time)),
    }));
}

export function weekdayLabel(ymd: string): string {
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
  return names[weekdaySun0(ymd)] ?? ymd;
}

export function matchesDayChip(startYmd: string | undefined, day: string, now = new Date(), timeZone = TZ): boolean {
  if (day === 'All') return true;
  if (!startYmd) return false;
  const today = localYmd(now, timeZone);
  if (day === 'Today') return startYmd === today;
  if (day === 'Tomorrow') return startYmd === addDaysYmd(today, 1);
  return weekdayLabel(startYmd) === day;
}

/** Friday–Sunday of the current or upcoming weekend in Europe/Zurich. */
export function weekendYmdRange(now = new Date(), timeZone = TZ): { start: string; end: string } {
  const today = localYmd(now, timeZone);
  const dow = weekdaySun0(today);
  const daysToFriday = dow === 0 ? -2 : 5 - dow;
  const start = addDaysYmd(today, daysToFriday);
  return { start, end: addDaysYmd(start, 2) };
}

export function addYearsLocal(now: Date, years: number, timeZone = TZ): string {
  const ymd = localYmd(now, timeZone);
  const [year, month, day] = ymd.split('-').map(Number);
  const dt = new Date(Date.UTC((year ?? 0) + years, (month ?? 1) - 1, day ?? 1));
  return dt.toISOString().slice(0, 10);
}

export function formatApiDateTime(ymd: string, hms = '00:00:00'): string {
  return `${ymd} ${hms}`;
}
