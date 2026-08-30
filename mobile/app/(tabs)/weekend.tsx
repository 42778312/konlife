import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CalendarX } from 'lucide-react-native';
import { type EventItem } from '@/data/mockEvents';
import { weekendYmdRange } from '@/lib/partyInsider/dates';
import { layout, space, type } from '@/constants/theme';
import { useEvents } from '@/context/EventsProvider';
import { Screen } from '@/components/layout/Screen';
import { EventCard } from '@/components/events/EventCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

const DAY_ORDER = ['Fri', 'Sat', 'Sun'] as const;
const DAY_LABEL = { Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' } as const;
const WEEKDAY = { 5: 'Fri', 6: 'Sat', 0: 'Sun' } as const;

export default function WeekendScreen() {
  const { events, loading } = useEvents();
  const range = weekendYmdRange();

  const groups = useMemo(() => {
    const inWeekend = events.filter((e) => {
      const ymd = e.startDate ?? '';
      return ymd >= range.start && ymd <= range.end;
    });
    return DAY_ORDER.map((day) => ({
      day,
      label: DAY_LABEL[day],
      items: inWeekend
        .filter((e) => {
          const ymd = e.startDate ?? '';
          const dow = new Date(`${ymd}T12:00:00Z`).getUTCDay();
          return WEEKDAY[dow as 0 | 5 | 6] === day;
        })
        .sort((a, b) => a.time.localeCompare(b.time)),
    })).filter((g) => g.items.length > 0);
  }, [events, range.end, range.start]);

  return (
    <Screen>
      <View style={styles.page}>
        <View style={styles.head}>
          <Text style={styles.title} accessibilityRole="header">
            This weekend
          </Text>
          <Text style={styles.sub}>Friday to Sunday in Konstanz. Pick a night.</Text>
        </View>
        {loading && events.length === 0 ? (
          <View style={styles.group}>
            <Skeleton style={styles.sk} />
            <Skeleton style={styles.sk} />
          </View>
        ) : null}
        {groups.map((group) => (
          <View key={group.day} style={styles.group}>
            <Text style={type.section}>{group.label}</Text>
            {group.items.map((event: EventItem) => (
              <EventCard
                key={event.id}
                event={event}
                variant="list"
                instanceId={`weekend-${event.id}`}
              />
            ))}
          </View>
        ))}
        {!loading && groups.length === 0 ? (
          <EmptyState icon={CalendarX} title="Quiet weekend" message="No Konstanz nights listed for Friday to Sunday." />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    width: '100%',
    maxWidth: layout.sheetMax,
    alignSelf: 'center',
    paddingHorizontal: space.lg,
    gap: space['2xl'],
  },
  head: { gap: 8 },
  title: { ...type.display, fontSize: 40, lineHeight: 42 },
  sub: { ...type.body, maxWidth: 420 },
  group: { gap: 12 },
  sk: { height: 88, borderRadius: 12 },
});
