import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import { MOCK_EVENTS, type DayKey, type EventItem } from '@/data/mockEvents';
import { colors, fonts, hitSlop, radius } from '@/constants/theme';
import { Screen } from '@/components/layout/Screen';
import { DayPills } from '@/components/ui/DayPills';
import { useEventExpand } from '@/context/EventExpandContext';

const FRIDAY = MOCK_EVENTS.find((e) => e.id === 'techno-friday')!;
const SAT_A = MOCK_EVENTS.find((e) => e.id === 'student-night')!;
const SAT_B = MOCK_EVENTS.find((e) => e.id === 'afterparty')!;
const SUN = MOCK_EVENTS.find((e) => e.id === 'house-sundays')!;

export default function WeekendScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDay, setSelectedDay] = useState<DayKey>('Sat');

  const header = (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 8) }]}>
      <Text style={styles.title}>My Weekend</Text>
      <Text style={styles.subtitle}>Plan your nights out</Text>
    </View>
  );

  return (
    <Screen header={header}>
      <View style={styles.stack}>
        <DayPills selected={selectedDay} onSelect={setSelectedDay} />

        <ScheduleGroup label="FRIDAY" items={[FRIDAY]} />
        <ScheduleGroup label="SATURDAY" items={[SAT_A, SAT_B]} />
        <ScheduleGroup label="SUNDAY" items={[SUN]} />
      </View>
    </Screen>
  );
}

function ScheduleGroup({ label, items }: { label: string; items: EventItem[] }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>
      {items.map((event) => (
        <ScheduleRow key={event.id} event={event} />
      ))}
    </View>
  );
}

function ScheduleRow({ event }: { event: EventItem }) {
  const { openEvent } = useEventExpand();
  const [liked, setLiked] = useState(false);

  return (
    <Pressable
      onPress={() => openEvent(event.id, `weekend-${event.id}`)}
      style={styles.row}
    >
      <View style={styles.accent} />
      <View style={styles.rowBody}>
        <Text style={styles.time}>{event.time}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventVenue}>{event.venue}</Text>
          <Text style={styles.eventPrice}>🎟️ {event.price}</Text>
        </View>
        <Pressable
          hitSlop={hitSlop}
          onPress={() => setLiked((v) => !v)}
          style={styles.heart}
          accessibilityLabel="Like"
        >
          <Heart
            size={20}
            color={liked ? colors.rose : colors.zinc400}
            fill={liked ? colors.rose : 'transparent'}
            strokeWidth={2}
          />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: colors.bg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.zinc900,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 36,
    color: colors.white,
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.zinc400,
    marginTop: 2,
  },
  stack: {
    gap: 24,
  },
  group: {
    gap: 8,
  },
  groupLabel: {
    fontFamily: fonts.black,
    fontSize: 12,
    color: colors.zinc400,
    letterSpacing: 2,
  },
  row: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.zinc800,
    borderRadius: radius['2xl'],
    overflow: 'hidden',
    flexDirection: 'row',
    minHeight: 88,
    cursor: 'pointer',
  },
  accent: {
    width: 6,
    backgroundColor: colors.neon,
  },
  rowBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    gap: 16,
  },
  time: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.white,
    width: 56,
  },
  eventTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
  },
  eventVenue: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.zinc400,
    marginTop: 2,
  },
  eventPrice: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.neon,
    marginTop: 4,
  },
  heart: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
});
