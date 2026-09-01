import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CalendarX, ChevronLeft, ChevronRight, WifiOff } from 'lucide-react-native';
import type { EventItem } from '@/data/mockEvents';
import {
  addMonthsYmd,
  formatMonthName,
  localYmd,
  monthDayYmds,
  monthKey,
  startOfMonthYmd,
} from '@/lib/partyInsider/dates';
import { selectionTick } from '@/lib/haptics';
import { colors, fonts, layout, MIN_TOUCH, space, webCursor } from '@/constants/theme';
import { useEvents } from '@/context/EventsProvider';
import { Screen } from '@/components/layout/Screen';
import { DateCapsuleStrip } from '@/components/events/DateCapsuleStrip';
import { WeekendEventCard } from '@/components/events/WeekendEventCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

function isFeatured(event: EventItem): boolean {
  return Boolean(event.isFeatured || event.isPopular);
}

export default function WeekendScreen() {
  const { events, loading, error, refresh } = useEvents();
  const today = localYmd(new Date());
  const [monthYmd, setMonthYmd] = useState(() => startOfMonthYmd(today));
  const [selectedYmd, setSelectedYmd] = useState(today);
  const [refreshing, setRefreshing] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const didLand = useRef(false);

  const days = useMemo(() => monthDayYmds(monthYmd), [monthYmd]);

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

  useEffect(() => {
    if (loading || didLand.current) return;
    didLand.current = true;
    if ((eventsByDay.get(selectedYmd) ?? []).length) return;
    const next = events
      .map((event) => event.startDate)
      .filter((ymd): ymd is string => Boolean(ymd) && ymd >= today)
      .sort()[0];
    if (!next) return;
    setSelectedYmd(next);
    setMonthYmd(startOfMonthYmd(next));
  }, [loading, events, eventsByDay, selectedYmd, today]);

  const onSelectDay = useCallback(
    (ymd: string) => {
      setSelectedYmd(ymd);
      if (monthKey(ymd) !== monthKey(monthYmd)) {
        setMonthYmd(startOfMonthYmd(ymd));
      }
    },
    [monthYmd],
  );

  const onMonthChange = useCallback(
    (delta: number) => {
      selectionTick();
      const start = startOfMonthYmd(addMonthsYmd(monthYmd, delta));
      setMonthYmd(start);
      setSelectedYmd((current) => {
        if (monthKey(current) === monthKey(start)) return current;
        if (monthKey(today) === monthKey(start)) return today;
        return start;
      });
    },
    [monthYmd, today],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  return (
    <Screen onRefresh={onRefresh} refreshing={refreshing}>
      <View style={styles.page}>
        <View style={styles.titleRow}>
          <View style={styles.side} />
          <Text style={styles.screenTitle} accessibilityRole="header">
            Upcoming Event
          </Text>
          <Pressable
            onPress={() => {
              selectionTick();
              setHelpOpen((open) => !open);
            }}
            style={[styles.help, webCursor]}
            accessibilityRole="button"
            accessibilityState={{ expanded: helpOpen }}
            accessibilityLabel="How this screen works"
          >
            <Text style={styles.helpMark}>?</Text>
          </Pressable>
        </View>

        {helpOpen ? (
          <Text style={styles.hint}>
            Pick a date to see nights in Konstanz. The lime card is the featured night that day.
          </Text>
        ) : null}

        {error ? (
          <View style={styles.fail}>
            <EmptyState icon={WifiOff} title="Couldn’t load nights" message={error} />
            <Button label="Try again" onPress={() => void refresh()} />
          </View>
        ) : null}

        <View style={styles.monthRow}>
          <Text style={styles.month}>{formatMonthName(monthYmd)}</Text>
          <View style={styles.monthNav}>
            <Pressable
              onPress={() => onMonthChange(-1)}
              style={[styles.chevron, webCursor]}
              accessibilityRole="button"
              accessibilityLabel="Previous month"
            >
              <ChevronLeft size={18} color={colors.fg} strokeWidth={2.2} />
            </Pressable>
            <Pressable
              onPress={() => onMonthChange(1)}
              style={[styles.chevron, webCursor]}
              accessibilityRole="button"
              accessibilityLabel="Next month"
            >
              <ChevronRight size={18} color={colors.fg} strokeWidth={2.2} />
            </Pressable>
          </View>
        </View>

        {loading && events.length === 0 ? (
          <Skeleton style={styles.skStrip} />
        ) : (
          <View style={styles.strip}>
            <DateCapsuleStrip days={days} selectedYmd={selectedYmd} onSelect={onSelectDay} />
          </View>
        )}

        <View style={styles.list}>
          {loading && events.length === 0 ? (
            <>
              <Skeleton style={styles.skCard} />
              <Skeleton style={styles.skCard} />
            </>
          ) : dayEvents.length === 0 ? (
            <EmptyState
              icon={CalendarX}
              title="No nights listed"
              message={
                monthKey(selectedYmd) > monthKey(addMonthsYmd(today, 1))
                  ? 'Listings only run about eight weeks ahead.'
                  : 'Nothing in Konstanz for this date yet. Pick another day.'
              }
            />
          ) : (
            <>
              {lead ? (
                <WeekendEventCard event={lead} featured instanceId={`weekend-lead-${lead.id}`} />
              ) : null}
              {trail.map((event) => (
                <WeekendEventCard
                  key={`${event.id}-${event.startDate}`}
                  event={event}
                  instanceId={`weekend-${event.id}`}
                />
              ))}
            </>
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    width: '100%',
    maxWidth: layout.weekendMax,
    alignSelf: 'center',
    gap: space.xl,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: MIN_TOUCH,
  },
  side: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
  },
  screenTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.2,
    color: colors.fg,
  },
  help: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: MIN_TOUCH / 2,
    backgroundColor: colors.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpMark: {
    fontFamily: fonts.bold,
    fontSize: 18,
    lineHeight: 22,
    color: colors.highlighter,
  },
  hint: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
    marginTop: -8,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: MIN_TOUCH,
    marginTop: 4,
  },
  month: {
    fontFamily: fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
    color: colors.fg,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chevron: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strip: {
    overflow: 'hidden',
  },
  list: { gap: 12 },
  fail: { gap: 12 },
  skStrip: { height: 76, borderRadius: 38 },
  skCard: { height: 96, borderRadius: 24 },
});
