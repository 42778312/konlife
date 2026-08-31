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

export function monthKey(ymd: string): string {
  return ymd.slice(0, 7);
}

export function startOfMonthYmd(ymd: string): string {
  return `${monthKey(ymd)}-01`;
}

/** Shift by calendar months, clamped to the 1st so day-31 never overflows. */
export function addMonthsYmd(ymd: string, months: number): string {
  const [year, month] = ymd.split('-').map(Number);
  const dt = new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1 + months, 1));
  return dt.toISOString().slice(0, 10);
}

export function formatMonthName(ymd: string, timeZone = TZ): string {
  const [year, month, day] = ymd.split('-').map(Number);
  const utc = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1, 12));
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    month: 'long',
  }).format(utc);
}

export function formatMonthTitle(ymd: string, timeZone = TZ): string {
  const [year, month, day] = ymd.split('-').map(Number);
  const utc = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1, 12));
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    month: 'long',
    year: 'numeric',
  }).format(utc);
}

export function monthDayYmds(anchorYmd: string): string[] {
  const start = startOfMonthYmd(anchorYmd);
  const next = addMonthsYmd(start, 1);
  const days: string[] = [];
  for (let ymd = start; ymd < next; ymd = addDaysYmd(ymd, 1)) {
    days.push(ymd);
  }
  return days;
}

export function dayNumber(ymd: string): string {
  return String(Number(ymd.slice(8, 10)));
}

/** Wireframe clock label: 08:00 AM. */
export function formatClock12(time: string): string {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})(?:\s*([AaPp][Mm]))?/);
  if (!match) return time;
  if (match[3]) {
    return `${match[1].padStart(2, '0')}:${match[2]} ${match[3].toUpperCase()}`;
  }
  let hour = Number(match[1]);
  const min = match[2];
  const suffix = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${String(hour).padStart(2, '0')}:${min} ${suffix}`;
}

export function formatAgendaDate(ymd: string, now = new Date(), timeZone = TZ): string {
  const today = localYmd(now, timeZone);
  const [year, month, day] = ymd.split('-').map(Number);
  const utc = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1, 12));
  const long = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(utc);
  if (ymd === today) return `Today · ${long}`;
  if (ymd === addDaysYmd(today, 1)) return `Tomorrow · ${long}`;
  return long;
}

export type CalendarCell = {
  ymd: string;
  inMonth: boolean;
  weekday: number;
};

/** Six weeks, Monday-first — iPhone Calendar in a German locale. */
export function monthGrid(anchorYmd: string): CalendarCell[] {
  const first = startOfMonthYmd(anchorYmd);
  const [year, month] = first.split('-').map(Number);
  const mondayOffset = (weekdaySun0(first) + 6) % 7;
  const start = addDaysYmd(first, -mondayOffset);
  return Array.from({ length: 42 }, (_, i) => {
    const ymd = addDaysYmd(start, i);
    const [y, m] = ymd.split('-').map(Number);
    return {
      ymd,
      inMonth: y === year && m === month,
      weekday: weekdaySun0(ymd),
    };
  });
}

export function isWeekendYmd(ymd: string): boolean {
  const dow = weekdaySun0(ymd);
  return dow === 0 || dow === 5 || dow === 6;
}
