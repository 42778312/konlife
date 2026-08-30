import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CalendarX, WifiOff } from 'lucide-react-native';
import { DAYS, type DayKey } from '@/data/mockEvents';
import { addDaysYmd, groupEventsByDate, localYmd, matchesDayChip, weekendYmdRange } from '@/lib/partyInsider/dates';
import { layout, space, type } from '@/constants/theme';
import { useEvents } from '@/context/EventsProvider';
import { Screen } from '@/components/layout/Screen';
import { EventCard } from '@/components/events/EventCard';
import { SearchInput } from '@/components/ui/SearchInput';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Chip } from '@/components/ui/Chip';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

export default function HomeScreen() {
  const router = useRouter();
  const { desktop } = useBreakpoint();
  const { events, loading, error, refresh } = useEvents();
  const [query, setQuery] = useState('');
  const [day, setDay] = useState<DayKey | 'All'>('All');
  const [refreshing, setRefreshing] = useState(false);

  const today = localYmd(new Date());
  const weekend = weekendYmdRange();
  const horizon = addDaysYmd(today, 14);

  const featured = useMemo(
    () => events.find((e) => (e.startDate ?? '') >= today) ?? events[0],
    [events, today],
  );

  const thisWeek = useMemo(() => {
    return events.filter((e) => {
      const ymd = e.startDate ?? '';
      if (ymd < weekend.start || ymd > weekend.end) return false;
      return e.id !== featured?.id;
    });
  }, [events, featured?.id, weekend.end, weekend.start]);

  const happening = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      const ymd = e.startDate ?? '';
      if (ymd < today || ymd > horizon) return false;
      if (!matchesDayChip(ymd, day)) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, day, events, today, horizon]);

  const happeningGroups = useMemo(() => groupEventsByDate(happening), [happening]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  return (
    <Screen onRefresh={onRefresh} refreshing={refreshing}>
      <View style={styles.page}>
        <View style={styles.intro}>
          <Text style={styles.headline} accessibilityRole="header">
            Out this week
          </Text>
          <Text style={styles.lede}>Nights worth leaving the house for in Konstanz.</Text>
          <SearchInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search nights, venues, genres"
            variant="pill"
          />
        </View>

        {error ? (
          <View style={styles.fail}>
            <EmptyState icon={WifiOff} title="Couldn’t load nights" message={error} />
            <Button label="Try again" onPress={() => void refresh()} />
          </View>
        ) : null}

        {loading && events.length === 0 ? (
          <View style={styles.skeletons}>
            <Skeleton style={styles.skHero} />
            <Skeleton style={styles.skRow} />
            <Skeleton style={styles.skRow} />
          </View>
        ) : null}

        {featured ? <EventCard event={featured} variant="featured" instanceId="home-featured" /> : null}

        <SectionHeader title="This weekend" actionLabel="See all" onAction={() => router.push('/weekend')} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
          decelerationRate="fast"
          nestedScrollEnabled
        >
          {thisWeek.map((event) => (
            <EventCard key={event.id} event={event} variant="horizontal" instanceId="home-week" />
          ))}
        </ScrollView>

        <SectionHeader title="Happening" />
        <View style={styles.days}>
          <Chip label="All" selected={day === 'All'} onPress={() => setDay('All')} />
          {DAYS.map((d) => (
            <Chip key={d} label={d} selected={day === d} onPress={() => setDay(d)} />
          ))}
        </View>
        <View style={styles.grid}>
          {happeningGroups.map((group) => (
            <View key={group.ymd} style={styles.dayGroup}>
              <Text style={type.section}>{group.label}</Text>
              <View style={[styles.dayItems, desktop && styles.gridDesk]}>
                {group.items.map((event) => (
                  <View key={`${event.id}-${event.startDate}`} style={desktop ? styles.gridItem : undefined}>
                    <EventCard event={event} variant={desktop ? 'standard' : 'list'} instanceId="home-list" />
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
        {!loading && !error && happening.length === 0 ? (
          <EmptyState icon={CalendarX} title="No nights in this window" message="Try another day or open Explore." />
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
  intro: { gap: 10 },
  headline: { ...type.display },
  lede: { ...type.body, maxWidth: 420, marginBottom: 4 },
  hScroll: { flexDirection: 'row', gap: 12, paddingBottom: 4 },
  days: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: -12 },
  grid: { gap: 20 },
  dayGroup: { gap: 12 },
  dayItems: { gap: 12 },
  gridDesk: { flexDirection: 'row', flexWrap: 'wrap' },
  gridItem: { width: '48%', flexGrow: 1 },
  fail: { gap: 12 },
  skeletons: { gap: 12 },
  skHero: { height: 220, borderRadius: 16 },
  skRow: { height: 88, borderRadius: 12 },
});
