import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MOCK_EVENTS, type EventItem } from '@/data/mockEvents';
import { layout, space, type } from '@/constants/theme';
import { Screen } from '@/components/layout/Screen';
import { EventCard } from '@/components/events/EventCard';

const DAY_ORDER = ['Fri', 'Sat', 'Sun'] as const;
const DAY_LABEL = { Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' } as const;

export default function WeekendScreen() {
  const groups = useMemo(() => {
    return DAY_ORDER.map((day) => ({
      day,
      label: DAY_LABEL[day],
      items: MOCK_EVENTS.filter((e) => e.dayOfWeek === day).sort((a, b) => a.time.localeCompare(b.time)),
    })).filter((g) => g.items.length > 0);
  }, []);

  return (
    <Screen>
      <View style={styles.page}>
        <View style={styles.head}>
          <Text style={styles.title} accessibilityRole="header">
            This weekend
          </Text>
          <Text style={styles.sub}>Friday to Sunday in Konstanz. Pick a night.</Text>
        </View>
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
});
