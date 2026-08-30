import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CalendarX, WifiOff } from 'lucide-react-native';
import type { EventItem } from '@/data/mockEvents';
import {
  addMonthsYmd,
  formatAgendaDate,
  localYmd,
  monthKey,
  startOfMonthYmd,
} from '@/lib/partyInsider/dates';
import { layout, space, type } from '@/constants/theme';
import { useEvents } from '@/context/EventsProvider';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { Screen } from '@/components/layout/Screen';
import { MonthCalendar } from '@/components/events/MonthCalendar';
import { CalendarAgendaRow } from '@/components/events/CalendarAgenda';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

function isFeatured(event: EventItem): boolean {
  return Boolean(event.isFeatured || event.isPopular);
}

export default function WeekendScreen() {
  const { events, loading, error, refresh } = useEvents();
  const { desktop } = useBreakpoint();
  const today = localYmd(new Date());
  const [monthYmd, setMonthYmd] = useState(() => startOfMonthYmd(today));
  const [selectedYmd, setSelectedYmd] = useState(today);
  const [refreshing, setRefreshing] = useState(false);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, EventItem[]>();
    for (const event of events) {
      const ymd = event.startDate;
      if (!ymd) continue;
      const list = map.get(ymd);
      if (list) list.push(event);
      else map.set(ymd, [event]);
    }
    for (const list of map.values()) {
      list.sort((a, b) => {
        const featured = Number(isFeatured(b)) - Number(isFeatured(a));
        if (featured) return featured;
        return a.time.localeCompare(b.time);
      });
    }
    return map;
  }, [events]);

  const dayEvents = eventsByDay.get(selectedYmd) ?? [];
  const featured = dayEvents.filter(isFeatured);
  const rest = featured.length ? dayEvents.filter((e) => !isFeatured(e)) : dayEvents.slice(1);
  const lead = featured[0] ?? (featured.length ? undefined : dayEvents[0]);
  const trail = featured.length ? [...featured.slice(1), ...rest] : rest;

  const onSelectDay = useCallback((ymd: string) => {
    setSelectedYmd(ymd);
    if (monthKey(ymd) !== monthKey(monthYmd)) {
      setMonthYmd(startOfMonthYmd(ymd));
    }
  }, [monthYmd]);

  const onMonthChange = useCallback((next: string) => {
    const start = startOfMonthYmd(next);
    setMonthYmd(start);
    setSelectedYmd((current) => {
      if (monthKey(current) === monthKey(start)) return current;
      if (monthKey(today) === monthKey(start)) return today;
      return start;
    });
  }, [today]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  return (
    <Screen onRefresh={onRefresh} refreshing={refreshing}>
      <View style={styles.page}>
        {error ? (
          <View style={styles.fail}>
            <EmptyState icon={WifiOff} title="Couldn’t load nights" message={error} />
            <Button label="Try again" onPress={() => void refresh()} />
          </View>
        ) : null}

        {loading && events.length === 0 ? (
          <View style={styles.skels}>
            <Skeleton style={styles.skHead} />
            <Skeleton style={styles.skGrid} />
          </View>
        ) : (
          <MonthCalendar
            monthYmd={monthYmd}
            selectedYmd={selectedYmd}
            todayYmd={today}
            eventsByDay={eventsByDay}
            showTitles={desktop}
            onSelectDay={onSelectDay}
            onMonthChange={onMonthChange}
          />
        )}

        <View style={styles.agenda}>
          <Text style={styles.agendaDate}>{formatAgendaDate(selectedYmd)}</Text>
          {loading && events.length === 0 ? (
            <>
              <Skeleton style={styles.skRow} />
              <Skeleton style={styles.skRow} />
            </>
          ) : dayEvents.length === 0 ? (
            <EmptyState
              icon={CalendarX}
              title="No nights listed"
              message={
                monthKey(selectedYmd) > monthKey(addMonthsYmd(today, 1))
                  ? 'Listings only run about eight weeks ahead.'
                  : 'Nothing in Konstanz for this date yet. Pick a day with a mark.'
              }
            />
          ) : (
            <View style={styles.list}>
              {lead ? (
                <CalendarAgendaRow
                  event={lead}
                  featured
                  instanceId={`weekend-lead-${lead.id}`}
                />
              ) : null}
              {trail.map((event) => (
                <CalendarAgendaRow
                  key={`${event.id}-${event.startDate}`}
                  event={event}
                  instanceId={`weekend-${event.id}`}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    width: '100%',
    maxWidth: layout.sheetMax,
    alignSelf: 'center',
    gap: space['2xl'],
  },
  fail: { gap: 12 },
  skels: { gap: 12 },
  skHead: { height: 36, width: 220, borderRadius: 8 },
  skGrid: { height: 280, borderRadius: 12 },
  skRow: { height: 64, borderRadius: 12 },
  agenda: { gap: 8 },
  agendaDate: { ...type.section, fontSize: 22, lineHeight: 26 },
  list: { gap: 2 },
});
